import { Express } from 'express';
import { authMiddleware } from '../middleware/auth';
import { storage } from '../storage';

// Admin middleware to check if user is admin
const adminMiddleware = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Check if user is admin (you can implement proper admin role checking)
  const isAdmin = req.user.email === 'admin@sharewheelz.uk' || req.user.userType === 'admin';
  
  if (!isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

export function registerAdminRoutes(app: Express) {
  // Admin routes - all require authentication and admin privileges
  app.use('/api/admin', authMiddleware, adminMiddleware);

  // Get all users
  app.get('/api/admin/users', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get user by ID
  app.get('/api/admin/users/:id', async (req, res) => {
    try {
      const user = await storage.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Block/Unblock user
  app.post('/api/admin/users/:id/block', async (req, res) => {
    try {
      const success = await storage.updateUser(req.params.id, { isBlocked: true });
      if (!success) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ success: true, message: 'User blocked successfully' });
    } catch (error) {
      console.error('Error blocking user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/admin/users/:id/unblock', async (req, res) => {
    try {
      const success = await storage.updateUser(req.params.id, { isBlocked: false });
      if (!success) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ success: true, message: 'User unblocked successfully' });
    } catch (error) {
      console.error('Error unblocking user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Verify/Unverify user
  app.post('/api/admin/users/:id/verify', async (req, res) => {
    try {
      const success = await storage.updateUser(req.params.id, { 
        isIdVerified: true,
        isLicenseVerified: true 
      });
      if (!success) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ success: true, message: 'User verified successfully' });
    } catch (error) {
      console.error('Error verifying user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/admin/users/:id/unverify', async (req, res) => {
    try {
      const success = await storage.updateUser(req.params.id, { 
        isIdVerified: false,
        isLicenseVerified: false 
      });
      if (!success) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ success: true, message: 'User unverified successfully' });
    } catch (error) {
      console.error('Error unverifying user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get all cars
  app.get('/api/admin/cars', async (req, res) => {
    try {
      const cars = await storage.getAllCars();
      // Enrich with owner information
      const enrichedCars = await Promise.all(cars.map(async (car) => {
        const owner = await storage.getUserById(car.ownerId);
        return {
          ...car,
          ownerName: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'
        };
      }));
      res.json(enrichedCars);
    } catch (error) {
      console.error('Error fetching cars:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get car by ID
  app.get('/api/admin/cars/:id', async (req, res) => {
    try {
      const car = await storage.getCarById(req.params.id);
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }
      
      const owner = await storage.getUserById(car.ownerId);
      res.json({
        ...car,
        ownerName: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'
      });
    } catch (error) {
      console.error('Error fetching car:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update car availability
  app.post('/api/admin/cars/:id/toggle-availability', async (req, res) => {
    try {
      const car = await storage.getCarById(req.params.id);
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }
      
      const success = await storage.updateCar(req.params.id, { 
        isAvailable: !car.isAvailable 
      });
      
      if (!success) {
        return res.status(404).json({ error: 'Car not found' });
      }
      
      res.json({ 
        success: true, 
        message: `Car ${!car.isAvailable ? 'made available' : 'made unavailable'} successfully` 
      });
    } catch (error) {
      console.error('Error toggling car availability:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Admin: Update any car details (bypasses ownership requirements)
  app.put('/api/admin/cars/:id', async (req, res) => {
    try {
      const carId = req.params.id;
      const updateData = req.body;
      
      // Remove any fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.createdAt;
      
      const success = await storage.updateCar(carId, updateData);
      
      if (!success) {
        return res.status(404).json({ error: 'Car not found' });
      }
      
      // Get the updated car
      const updatedCar = await storage.getCarById(carId);
      const owner = await storage.getUserById(updatedCar.ownerId);
      
      res.json({
        message: 'Car updated successfully',
        car: {
          ...updatedCar,
          ownerName: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'
        }
      });
    } catch (error) {
      console.error('Error updating car:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get all bookings
  app.get('/api/admin/bookings', async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      // Enrich with user and car information
      const enrichedBookings = await Promise.all(bookings.map(async (booking) => {
        const [car, renter, owner] = await Promise.all([
          storage.getCarById(booking.carId),
          storage.getUserById(booking.renterId),
          storage.getUserById(booking.ownerId)
        ]);
        
        return {
          ...booking,
          carTitle: car ? `${car.make} ${car.model}` : 'Unknown Car',
          renterName: renter ? `${renter.firstName} ${renter.lastName}` : 'Unknown Renter',
          ownerName: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown Owner'
        };
      }));
      res.json(enrichedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get booking by ID
  app.get('/api/admin/bookings/:id', async (req, res) => {
    try {
      const booking = await storage.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      
      const [car, renter, owner] = await Promise.all([
        storage.getCarById(booking.carId),
        storage.getUserById(booking.renterId),
        storage.getUserById(booking.ownerId)
      ]);
      
      res.json({
        ...booking,
        carTitle: car ? `${car.make} ${car.model}` : 'Unknown Car',
        renterName: renter ? `${renter.firstName} ${renter.lastName}` : 'Unknown Renter',
        ownerName: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown Owner'
      });
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update booking status
  app.post('/api/admin/bookings/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      
      const success = await storage.updateBooking(req.params.id, { status });
      if (!success) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      
      res.json({ success: true, message: 'Booking status updated successfully' });
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get all messages
  app.get('/api/admin/messages', async (req, res) => {
    try {
      const messages = await storage.getAllMessages();
      // Enrich with user information
      const enrichedMessages = await Promise.all(messages.map(async (message) => {
        const [sender, receiver] = await Promise.all([
          storage.getUserById(message.senderId),
          storage.getUserById(message.receiverId)
        ]);
        
        return {
          ...message,
          senderName: sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown Sender',
          receiverName: receiver ? `${receiver.firstName} ${receiver.lastName}` : 'Unknown Receiver'
        };
      }));
      res.json(enrichedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get all support tickets
  app.get('/api/admin/support-tickets', async (req, res) => {
    try {
      const tickets = await storage.getAllSupportTickets();
      // Enrich with user information
      const enrichedTickets = await Promise.all(tickets.map(async (ticket) => {
        const user = await storage.getUserById(ticket.userId);
        return {
          ...ticket,
          userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown User'
        };
      }));
      res.json(enrichedTickets);
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create support ticket
  app.post('/api/admin/support-tickets', async (req, res) => {
    try {
      const { userId, subject, description, priority = 'medium' } = req.body;
      
      if (!userId || !subject || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const ticket = await storage.createSupportTicket({
        userId,
        subject,
        description,
        priority,
        status: 'open'
      });
      
      res.status(201).json(ticket);
    } catch (error) {
      console.error('Error creating support ticket:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update support ticket
  app.post('/api/admin/support-tickets/:id/assign', async (req, res) => {
    try {
      const { assignedTo } = req.body;
      const success = await storage.updateSupportTicket(req.params.id, { 
        assignedTo,
        status: 'in_progress'
      });
      
      if (!success) {
        return res.status(404).json({ error: 'Support ticket not found' });
      }
      
      res.json({ success: true, message: 'Support ticket assigned successfully' });
    } catch (error) {
      console.error('Error assigning support ticket:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/admin/support-tickets/:id/resolve', async (req, res) => {
    try {
      const success = await storage.updateSupportTicket(req.params.id, { 
        status: 'resolved'
      });
      
      if (!success) {
        return res.status(404).json({ error: 'Support ticket not found' });
      }
      
      res.json({ success: true, message: 'Support ticket resolved successfully' });
    } catch (error) {
      console.error('Error resolving support ticket:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/admin/support-tickets/:id/close', async (req, res) => {
    try {
      const success = await storage.updateSupportTicket(req.params.id, { 
        status: 'closed'
      });
      
      if (!success) {
        return res.status(404).json({ error: 'Support ticket not found' });
      }
      
      res.json({ success: true, message: 'Support ticket closed successfully' });
    } catch (error) {
      console.error('Error closing support ticket:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get system statistics
  app.get('/api/admin/stats', async (req, res) => {
    try {
      const [users, cars, bookings, messages, tickets] = await Promise.all([
        storage.getAllUsers(),
        storage.getAllCars(),
        storage.getAllBookings(),
        storage.getAllMessages(),
        storage.getAllSupportTickets()
      ]);
      
      const stats = {
        users: {
          total: users.length,
          active: users.filter(u => !u.isBlocked).length,
          blocked: users.filter(u => u.isBlocked).length,
          verified: users.filter(u => u.isEmailVerified && u.isIdVerified).length
        },
        cars: {
          total: cars.length,
          available: cars.filter(c => c.isAvailable).length,
          unavailable: cars.filter(c => !c.isAvailable).length
        },
        bookings: {
          total: bookings.length,
          pending: bookings.filter(b => b.status === 'pending').length,
          active: bookings.filter(b => b.status === 'active').length,
          completed: bookings.filter(b => b.status === 'completed').length,
          cancelled: bookings.filter(b => b.status === 'cancelled').length
        },
        messages: {
          total: messages.length,
          unread: messages.filter(m => !m.isRead).length
        },
        supportTickets: {
          total: tickets.length,
          open: tickets.filter(t => t.status === 'open').length,
          inProgress: tickets.filter(t => t.status === 'in_progress').length,
          resolved: tickets.filter(t => t.status === 'resolved').length,
          closed: tickets.filter(t => t.status === 'closed').length,
          urgent: tickets.filter(t => t.priority === 'urgent').length
        }
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Error fetching system stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}
