import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  Gift, 
  Camera,
  CheckCircle,
  ArrowRight,
  Clock,
  Heart,
  Sparkles,
  Award,
  Crown,
  Zap,
  Car,
  Wine,
  Music,
  Gamepad2,
  Utensils,
  Plane
} from 'lucide-react';
import { Link } from 'wouter';

export default function MemberEvents() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Luxury Car Showcase",
      date: "2024-02-15",
      time: "18:00",
      location: "London, UK",
      type: "Exhibition",
      description: "Exclusive showcase of our premium luxury vehicles with test drives and expert presentations.",
      capacity: 50,
      registered: 32,
      price: "Free for Elite members",
      icon: Car,
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: 2,
      title: "Member Networking Mixer",
      date: "2024-02-22",
      time: "19:00",
      location: "Manchester, UK",
      type: "Networking",
      description: "Connect with fellow ShareWheelz members over drinks and appetizers.",
      capacity: 100,
      registered: 67,
      price: "Free for Premium+ members",
      icon: Users,
      color: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      title: "Photography Workshop",
      date: "2024-03-01",
      time: "10:00",
      location: "Birmingham, UK",
      type: "Workshop",
      description: "Learn professional car photography techniques with our expert photographer.",
      capacity: 25,
      registered: 18,
      price: "£25 for all members",
      icon: Camera,
      color: "bg-purple-100 text-purple-800"
    },
    {
      id: 4,
      title: "Wine Tasting Evening",
      date: "2024-03-08",
      time: "19:30",
      location: "Edinburgh, UK",
      type: "Social",
      description: "Exclusive wine tasting event with premium selections and gourmet pairings.",
      capacity: 40,
      registered: 28,
      price: "Free for Gold+ members",
      icon: Wine,
      color: "bg-red-100 text-red-800"
    }
  ];

  const eventCategories = [
    {
      name: "Exhibitions",
      description: "Vehicle showcases and demonstrations",
      icon: Car,
      color: "bg-blue-100 text-blue-800"
    },
    {
      name: "Networking",
      description: "Meet and connect with other members",
      icon: Users,
      color: "bg-green-100 text-green-800"
    },
    {
      name: "Workshops",
      description: "Educational sessions and skill building",
      icon: Award,
      color: "bg-purple-100 text-purple-800"
    },
    {
      name: "Social Events",
      description: "Fun activities and entertainment",
      icon: Heart,
      color: "bg-pink-100 text-pink-800"
    }
  ];

  const memberBenefits = [
    {
      icon: Crown,
      title: "Exclusive Access",
      description: "Member-only events and early registration",
      benefits: [
        "Priority booking for all events",
        "Exclusive member-only events",
        "Early access to new events",
        "Special member pricing"
      ]
    },
    {
      icon: Gift,
      title: "Special Rewards",
      description: "Earn points and get exclusive perks",
      benefits: [
        "Bonus loyalty points for attendance",
        "Exclusive event merchandise",
        "Free upgrades and extras",
        "Member appreciation gifts"
      ]
    },
    {
      icon: Star,
      title: "Premium Experience",
      description: "High-quality events and experiences",
      benefits: [
        "Professional event organization",
        "Expert speakers and instructors",
        "Premium venues and locations",
        "Complimentary refreshments"
      ]
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Connect with like-minded members",
      benefits: [
        "Networking opportunities",
        "Member meetups and groups",
        "Shared experiences and memories",
        "Building lasting friendships"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      membership: "Elite",
      event: "Luxury Car Showcase",
      text: "The luxury car showcase was incredible! I got to test drive cars I never thought I'd have access to. The event was beautifully organized and the staff were amazing.",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      membership: "Premium",
      event: "Member Networking Mixer",
      text: "Great networking event! I met so many interesting people and made valuable connections. The atmosphere was relaxed and welcoming.",
      avatar: "MC"
    },
    {
      name: "Emma Williams",
      membership: "Gold",
      event: "Photography Workshop",
      text: "The photography workshop was fantastic! I learned so much about car photography and the instructor was very knowledgeable and patient.",
      avatar: "EW"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 text-pink-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Member Events</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join exclusive events designed just for ShareWheelz members. 
            Connect, learn, and enjoy special experiences with our community.
          </p>
        </div>

        {/* Event Categories */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-purple-600" />
              Event Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {eventCategories.map((category, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <category.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-6 w-6 mr-2 text-blue-600" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <event.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(event.date)}</span>
                          <Clock className="h-4 w-4 ml-3 mr-1" />
                          <span>{event.time}</span>
                          <MapPin className="h-4 w-4 ml-3 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={event.color}>
                      {event.type}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{event.registered}/{event.capacity} registered</span>
                      </div>
                      <div className="flex items-center">
                        <Gift className="h-4 w-4 mr-1" />
                        <span>{event.price}</span>
                      </div>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Register Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Member Benefits */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="h-6 w-6 mr-2 text-yellow-600" />
              Member Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {memberBenefits.map((benefit, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center">
                    <benefit.icon className="h-8 w-8 text-purple-600 mr-4" />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-12">
                    {benefit.benefits.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Member Testimonials */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-6 w-6 mr-2 text-red-600" />
              What Members Say
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.event}</div>
                      <Badge className="mt-1 bg-purple-100 text-purple-800">
                        {testimonial.membership}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm italic">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Calendar */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-green-600" />
              Event Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Stay updated with all upcoming member events and never miss an opportunity to connect with our community.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800">This Month</h3>
                  <p className="text-sm text-blue-600">4 events scheduled</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800">Next Month</h3>
                  <p className="text-sm text-green-600">6 events planned</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-800">This Year</h3>
                  <p className="text-sm text-purple-600">50+ events total</p>
                </div>
              </div>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View Full Calendar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="shadow-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Member Events!</h2>
            <p className="text-xl mb-8 opacity-90">
              Become a member and gain access to exclusive events and experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/become-member">
                <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                  <Crown className="h-5 w-5 mr-2" />
                  Become a Member
                </Button>
              </Link>
              <Link href="/membership-benefits">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
                  <Star className="h-5 w-5 mr-2" />
                  View Benefits
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

