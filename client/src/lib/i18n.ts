import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        vehicles: 'Vehicles',
        about: 'About',
        becomeHost: 'Become Host',
        security: 'Security',
        login: 'Login',
        register: 'Register',
        dashboard: 'Dashboard',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout'
      },
      
      // Authentication
      auth: {
        login: 'Login',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        firstName: 'First Name',
        lastName: 'Last Name',
        phone: 'Phone',
        userType: 'User Type',
        renter: 'Renter',
        owner: 'Owner',
        both: 'Both',
        loginSuccess: 'Login successful!',
        registerSuccess: 'Account created successfully!',
        loginError: 'Login failed. Please check your credentials.',
        registerError: 'Registration failed. Please try again.',
        emailRequired: 'Email is required',
        passwordRequired: 'Password is required',
        passwordMinLength: 'Password must be at least 8 characters',
        passwordMatch: 'Passwords must match',
        firstNameRequired: 'First name is required',
        lastNameRequired: 'Last name is required',
        phoneRequired: 'Phone number is required'
      },

      // Car listings
      cars: {
        title: 'Available Vehicles',
        searchPlaceholder: 'Search by location, make, or model...',
        filters: 'Filters',
        priceRange: 'Price Range',
        fuelType: 'Fuel Type',
        transmission: 'Transmission',
        seats: 'Seats',
        available: 'Available',
        unavailable: 'Unavailable',
        perDay: 'per day',
        bookNow: 'Book Now',
        viewDetails: 'View Details',
        addToFavorites: 'Add to Favorites',
        removeFromFavorites: 'Remove from Favorites',
        popular: 'Popular',
        verified: 'Verified',
        newListing: 'New Listing',
        lowPrice: 'Great Price',
        highRating: 'Highly Rated'
      },

      // Car details
      carDetails: {
        overview: 'Overview',
        features: 'Features',
        reviews: 'Reviews',
        location: 'Location',
        owner: 'Owner',
        rating: 'Rating',
        reviewsCount: 'reviews',
        fuelType: 'Fuel Type',
        transmission: 'Transmission',
        seats: 'Seats',
        year: 'Year',
        mileage: 'Mileage',
        features: 'Features',
        safety: 'Safety',
        entertainment: 'Entertainment',
        convenience: 'Convenience',
        bookThisCar: 'Book This Car',
        selectDates: 'Select Dates',
        startDate: 'Start Date',
        endDate: 'End Date',
        totalPrice: 'Total Price',
        serviceFee: 'Service Fee',
        insurance: 'Insurance',
        totalAmount: 'Total Amount'
      },

      // Booking
      booking: {
        title: 'Complete Your Booking',
        carSummary: 'Car Summary',
        rentalPeriod: 'Rental Period',
        pricing: 'Pricing',
        paymentMethod: 'Payment Method',
        card: 'Credit Card',
        cardNumber: 'Card Number',
        expiryDate: 'Expiry Date',
        cvv: 'CVV',
        cardholderName: 'Cardholder Name',
        billingAddress: 'Billing Address',
        confirmBooking: 'Confirm Booking',
        bookingConfirmed: 'Booking Confirmed!',
        bookingId: 'Booking ID',
        confirmationEmail: 'You will receive a confirmation email shortly.',
        totalAmount: 'Total Amount',
        processingPayment: 'Processing payment...',
        paymentSuccess: 'Payment successful!',
        paymentFailed: 'Payment failed. Please try again.'
      },

      // Dashboard
      dashboard: {
        welcome: 'Welcome',
        overview: 'Overview',
        myCars: 'My Cars',
        myBookings: 'My Bookings',
        earnings: 'Earnings',
        analytics: 'Analytics',
        totalEarnings: 'Total Earnings',
        totalBookings: 'Total Bookings',
        averageRating: 'Average Rating',
        activeListings: 'Active Listings',
        upcomingBookings: 'Upcoming Bookings',
        recentBookings: 'Recent Bookings',
        addNewCar: 'Add New Car',
        manageCars: 'Manage Cars',
        viewAllBookings: 'View All Bookings',
        noCars: 'No cars listed yet',
        noBookings: 'No bookings yet',
        memberSince: 'Member since'
      },

      // Forms
      forms: {
        required: 'This field is required',
        invalidEmail: 'Please enter a valid email address',
        invalidPhone: 'Please enter a valid phone number',
        minLength: 'Must be at least {{count}} characters',
        maxLength: 'Must be no more than {{count}} characters',
        selectOption: 'Please select an option',
        uploadImage: 'Upload Image',
        dragDrop: 'Drag and drop images here, or click to select',
        maxImages: 'Maximum {{count}} images allowed',
        imageSize: 'Image size must be less than {{size}}MB'
      },

      // Common
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        clear: 'Clear',
        apply: 'Apply',
        reset: 'Reset',
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        retry: 'Retry',
        refresh: 'Refresh',
        more: 'More',
        less: 'Less',
        show: 'Show',
        hide: 'Hide',
        view: 'View',
        download: 'Download',
        upload: 'Upload',
        select: 'Select',
        choose: 'Choose',
        browse: 'Browse',
        submit: 'Submit',
        continue: 'Continue',
        finish: 'Finish',
        complete: 'Complete',
        pending: 'Pending',
        active: 'Active',
        completed: 'Completed',
        cancelled: 'Cancelled',
        available: 'Available',
        unavailable: 'Unavailable',
        verified: 'Verified',
        unverified: 'Unverified'
      },

      // Error messages
      errors: {
        networkError: 'Network error. Please check your connection.',
        serverError: 'Server error. Please try again later.',
        notFound: 'The requested resource was not found.',
        unauthorized: 'You are not authorized to perform this action.',
        forbidden: 'Access denied.',
        validationError: 'Please check your input and try again.',
        bookingConflict: 'This car is not available for the selected dates.',
        paymentFailed: 'Payment processing failed. Please try again.',
        emailNotVerified: 'Please verify your email address.',
        phoneNotVerified: 'Please verify your phone number.',
        accountBlocked: 'Your account has been blocked. Contact support.',
        invalidCredentials: 'Invalid email or password.',
        userNotFound: 'User not found.',
        carNotFound: 'Car not found.',
        bookingNotFound: 'Booking not found.'
      },

      // Success messages
      success: {
        profileUpdated: 'Profile updated successfully!',
        carAdded: 'Car added successfully!',
        carUpdated: 'Car updated successfully!',
        carDeleted: 'Car deleted successfully!',
        bookingCreated: 'Booking created successfully!',
        bookingCancelled: 'Booking cancelled successfully!',
        reviewSubmitted: 'Review submitted successfully!',
        emailSent: 'Email sent successfully!',
        passwordChanged: 'Password changed successfully!',
        accountVerified: 'Account verified successfully!'
      }
    }
  },
  
  fr: {
    translation: {
      // Navigation
      nav: {
        home: 'Accueil',
        vehicles: 'Véhicules',
        about: 'À propos',
        becomeHost: 'Devenir Hôte',
        security: 'Sécurité',
        login: 'Connexion',
        register: 'S\'inscrire',
        dashboard: 'Tableau de bord',
        profile: 'Profil',
        settings: 'Paramètres',
        logout: 'Déconnexion'
      },
      
      // Authentication
      auth: {
        login: 'Se connecter',
        register: 'S\'inscrire',
        email: 'Email',
        password: 'Mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        firstName: 'Prénom',
        lastName: 'Nom',
        phone: 'Téléphone',
        userType: 'Type d\'utilisateur',
        renter: 'Locataire',
        owner: 'Propriétaire',
        both: 'Les deux',
        loginSuccess: 'Connexion réussie !',
        registerSuccess: 'Compte créé avec succès !',
        loginError: 'Échec de la connexion. Vérifiez vos identifiants.',
        registerError: 'Échec de l\'inscription. Veuillez réessayer.',
        emailRequired: 'L\'email est requis',
        passwordRequired: 'Le mot de passe est requis',
        passwordMinLength: 'Le mot de passe doit contenir au moins 8 caractères',
        passwordMatch: 'Les mots de passe doivent correspondre',
        firstNameRequired: 'Le prénom est requis',
        lastNameRequired: 'Le nom est requis',
        phoneRequired: 'Le numéro de téléphone est requis'
      },

      // Car listings
      cars: {
        title: 'Véhicules Disponibles',
        searchPlaceholder: 'Rechercher par localisation, marque ou modèle...',
        filters: 'Filtres',
        priceRange: 'Gamme de prix',
        fuelType: 'Type de carburant',
        transmission: 'Transmission',
        seats: 'Sièges',
        available: 'Disponible',
        unavailable: 'Indisponible',
        perDay: 'par jour',
        bookNow: 'Réserver maintenant',
        viewDetails: 'Voir les détails',
        addToFavorites: 'Ajouter aux favoris',
        removeFromFavorites: 'Retirer des favoris',
        popular: 'Populaire',
        verified: 'Vérifié',
        newListing: 'Nouvelle annonce',
        lowPrice: 'Excellent prix',
        highRating: 'Très bien noté'
      },

      // Car details
      carDetails: {
        overview: 'Aperçu',
        features: 'Caractéristiques',
        reviews: 'Avis',
        location: 'Localisation',
        owner: 'Propriétaire',
        rating: 'Note',
        reviewsCount: 'avis',
        fuelType: 'Type de carburant',
        transmission: 'Transmission',
        seats: 'Sièges',
        year: 'Année',
        mileage: 'Kilométrage',
        features: 'Caractéristiques',
        safety: 'Sécurité',
        entertainment: 'Divertissement',
        convenience: 'Confort',
        bookThisCar: 'Réserver cette voiture',
        selectDates: 'Sélectionner les dates',
        startDate: 'Date de début',
        endDate: 'Date de fin',
        totalPrice: 'Prix total',
        serviceFee: 'Frais de service',
        insurance: 'Assurance',
        totalAmount: 'Montant total'
      },

      // Booking
      booking: {
        title: 'Finaliser votre réservation',
        carSummary: 'Résumé de la voiture',
        rentalPeriod: 'Période de location',
        pricing: 'Tarification',
        paymentMethod: 'Méthode de paiement',
        card: 'Carte de crédit',
        cardNumber: 'Numéro de carte',
        expiryDate: 'Date d\'expiration',
        cvv: 'CVV',
        cardholderName: 'Nom du titulaire',
        billingAddress: 'Adresse de facturation',
        confirmBooking: 'Confirmer la réservation',
        bookingConfirmed: 'Réservation confirmée !',
        bookingId: 'ID de réservation',
        confirmationEmail: 'Vous recevrez un email de confirmation sous peu.',
        totalAmount: 'Montant total',
        processingPayment: 'Traitement du paiement...',
        paymentSuccess: 'Paiement réussi !',
        paymentFailed: 'Échec du paiement. Veuillez réessayer.'
      },

      // Dashboard
      dashboard: {
        welcome: 'Bienvenue',
        overview: 'Aperçu',
        myCars: 'Mes voitures',
        myBookings: 'Mes réservations',
        earnings: 'Gains',
        analytics: 'Analytiques',
        totalEarnings: 'Gains totaux',
        totalBookings: 'Réservations totales',
        averageRating: 'Note moyenne',
        activeListings: 'Annonces actives',
        upcomingBookings: 'Réservations à venir',
        recentBookings: 'Réservations récentes',
        addNewCar: 'Ajouter une nouvelle voiture',
        manageCars: 'Gérer les voitures',
        viewAllBookings: 'Voir toutes les réservations',
        noCars: 'Aucune voiture listée',
        noBookings: 'Aucune réservation',
        memberSince: 'Membre depuis'
      },

      // Forms
      forms: {
        required: 'Ce champ est requis',
        invalidEmail: 'Veuillez saisir une adresse email valide',
        invalidPhone: 'Veuillez saisir un numéro de téléphone valide',
        minLength: 'Doit contenir au moins {{count}} caractères',
        maxLength: 'Ne doit pas dépasser {{count}} caractères',
        selectOption: 'Veuillez sélectionner une option',
        uploadImage: 'Télécharger une image',
        dragDrop: 'Glissez-déposez les images ici, ou cliquez pour sélectionner',
        maxImages: 'Maximum {{count}} images autorisées',
        imageSize: 'La taille de l\'image doit être inférieure à {{size}}MB'
      },

      // Common
      common: {
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        save: 'Enregistrer',
        edit: 'Modifier',
        delete: 'Supprimer',
        close: 'Fermer',
        back: 'Retour',
        next: 'Suivant',
        previous: 'Précédent',
        search: 'Rechercher',
        filter: 'Filtrer',
        sort: 'Trier',
        clear: 'Effacer',
        apply: 'Appliquer',
        reset: 'Réinitialiser',
        yes: 'Oui',
        no: 'Non',
        ok: 'OK',
        retry: 'Réessayer',
        refresh: 'Actualiser',
        more: 'Plus',
        less: 'Moins',
        show: 'Afficher',
        hide: 'Masquer',
        view: 'Voir',
        download: 'Télécharger',
        upload: 'Télécharger',
        select: 'Sélectionner',
        choose: 'Choisir',
        browse: 'Parcourir',
        submit: 'Soumettre',
        continue: 'Continuer',
        finish: 'Terminer',
        complete: 'Compléter',
        pending: 'En attente',
        active: 'Actif',
        completed: 'Terminé',
        cancelled: 'Annulé',
        available: 'Disponible',
        unavailable: 'Indisponible',
        verified: 'Vérifié',
        unverified: 'Non vérifié'
      },

      // Error messages
      errors: {
        networkError: 'Erreur réseau. Vérifiez votre connexion.',
        serverError: 'Erreur serveur. Veuillez réessayer plus tard.',
        notFound: 'La ressource demandée n\'a pas été trouvée.',
        unauthorized: 'Vous n\'êtes pas autorisé à effectuer cette action.',
        forbidden: 'Accès refusé.',
        validationError: 'Veuillez vérifier votre saisie et réessayer.',
        bookingConflict: 'Cette voiture n\'est pas disponible pour les dates sélectionnées.',
        paymentFailed: 'Le traitement du paiement a échoué. Veuillez réessayer.',
        emailNotVerified: 'Veuillez vérifier votre adresse email.',
        phoneNotVerified: 'Veuillez vérifier votre numéro de téléphone.',
        accountBlocked: 'Votre compte a été bloqué. Contactez le support.',
        invalidCredentials: 'Email ou mot de passe invalide.',
        userNotFound: 'Utilisateur non trouvé.',
        carNotFound: 'Voiture non trouvée.',
        bookingNotFound: 'Réservation non trouvée.'
      },

      // Success messages
      success: {
        profileUpdated: 'Profil mis à jour avec succès !',
        carAdded: 'Voiture ajoutée avec succès !',
        carUpdated: 'Voiture mise à jour avec succès !',
        carDeleted: 'Voiture supprimée avec succès !',
        bookingCreated: 'Réservation créée avec succès !',
        bookingCancelled: 'Réservation annulée avec succès !',
        reviewSubmitted: 'Avis soumis avec succès !',
        emailSent: 'Email envoyé avec succès !',
        passwordChanged: 'Mot de passe modifié avec succès !',
        accountVerified: 'Compte vérifié avec succès !'
      }
    }
  },
  
  ar: {
    translation: {
      // Navigation
      nav: {
        home: 'الرئيسية',
        vehicles: 'المركبات',
        about: 'حول',
        becomeHost: 'كن مضيفاً',
        security: 'الأمان',
        login: 'تسجيل الدخول',
        register: 'التسجيل',
        dashboard: 'لوحة التحكم',
        profile: 'الملف الشخصي',
        settings: 'الإعدادات',
        logout: 'تسجيل الخروج'
      },
      
      // Authentication
      auth: {
        login: 'تسجيل الدخول',
        register: 'التسجيل',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        firstName: 'الاسم الأول',
        lastName: 'اسم العائلة',
        phone: 'الهاتف',
        userType: 'نوع المستخدم',
        renter: 'مستأجر',
        owner: 'مالك',
        both: 'كلاهما',
        loginSuccess: 'تم تسجيل الدخول بنجاح!',
        registerSuccess: 'تم إنشاء الحساب بنجاح!',
        loginError: 'فشل تسجيل الدخول. تحقق من بياناتك.',
        registerError: 'فشل التسجيل. يرجى المحاولة مرة أخرى.',
        emailRequired: 'البريد الإلكتروني مطلوب',
        passwordRequired: 'كلمة المرور مطلوبة',
        passwordMinLength: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
        passwordMatch: 'كلمات المرور يجب أن تتطابق',
        firstNameRequired: 'الاسم الأول مطلوب',
        lastNameRequired: 'اسم العائلة مطلوب',
        phoneRequired: 'رقم الهاتف مطلوب'
      },

      // Car listings
      cars: {
        title: 'المركبات المتاحة',
        searchPlaceholder: 'البحث حسب الموقع أو العلامة التجارية أو النموذج...',
        filters: 'المرشحات',
        priceRange: 'نطاق السعر',
        fuelType: 'نوع الوقود',
        transmission: 'ناقل الحركة',
        seats: 'المقاعد',
        available: 'متاح',
        unavailable: 'غير متاح',
        perDay: 'في اليوم',
        bookNow: 'احجز الآن',
        viewDetails: 'عرض التفاصيل',
        addToFavorites: 'إضافة للمفضلة',
        removeFromFavorites: 'إزالة من المفضلة',
        popular: 'شائع',
        verified: 'متحقق',
        newListing: 'إعلان جديد',
        lowPrice: 'سعر ممتاز',
        highRating: 'تقييم عالي'
      },

      // Common
      common: {
        loading: 'جاري التحميل...',
        error: 'خطأ',
        success: 'نجح',
        cancel: 'إلغاء',
        confirm: 'تأكيد',
        save: 'حفظ',
        edit: 'تعديل',
        delete: 'حذف',
        close: 'إغلاق',
        back: 'رجوع',
        next: 'التالي',
        previous: 'السابق',
        search: 'بحث',
        filter: 'تصفية',
        sort: 'ترتيب',
        clear: 'مسح',
        apply: 'تطبيق',
        reset: 'إعادة تعيين',
        yes: 'نعم',
        no: 'لا',
        ok: 'موافق',
        retry: 'إعادة المحاولة',
        refresh: 'تحديث',
        more: 'المزيد',
        less: 'أقل',
        show: 'إظهار',
        hide: 'إخفاء',
        view: 'عرض',
        download: 'تحميل',
        upload: 'رفع',
        select: 'اختيار',
        choose: 'اختر',
        browse: 'تصفح',
        submit: 'إرسال',
        continue: 'متابعة',
        finish: 'إنهاء',
        complete: 'إكمال',
        pending: 'في الانتظار',
        active: 'نشط',
        completed: 'مكتمل',
        cancelled: 'ملغي',
        available: 'متاح',
        unavailable: 'غير متاح',
        verified: 'متحقق',
        unverified: 'غير متحقق'
      }
    }
  }
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;

























