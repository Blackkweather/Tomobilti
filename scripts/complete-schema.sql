-- ShareWheelz Complete Schema (PostgreSQL)
-- Safe to run multiple times; uses IF NOT EXISTS and IF EXISTS checks.
-- Apply with psql/pgAdmin as a superuser or a role with sufficient privileges.

BEGIN;

-- Required for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =======================
-- Core Tables
-- =======================

CREATE TABLE IF NOT EXISTS public.users (
    id                  text PRIMARY KEY DEFAULT gen_random_uuid(),
    email               text NOT NULL UNIQUE,
    password            text NOT NULL,
    first_name          text NOT NULL,
    last_name           text NOT NULL,
    phone               text,
    profile_image       text,
    user_type           text NOT NULL DEFAULT 'renter', -- 'owner' | 'renter' | 'both'
    created_at          timestamp DEFAULT now(),
    updated_at          timestamp DEFAULT now(),
    email_verified      boolean DEFAULT false,
    email_verification_token   text,
    email_verification_expires timestamp
);

CREATE TABLE IF NOT EXISTS public.cars (
    id              text PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id        text NOT NULL,
    title           text NOT NULL,
    description     text,
    make            text NOT NULL,
    model           text NOT NULL,
    year            integer NOT NULL,
    fuel_type       text NOT NULL,        -- 'essence' | 'diesel' | 'electric' | 'hybrid'
    transmission    text NOT NULL,        -- 'manual' | 'automatic'
    seats           integer NOT NULL,
    price_per_day   numeric(10,2) NOT NULL,
    currency        text NOT NULL DEFAULT 'MAD',
    location        text NOT NULL,
    city            text NOT NULL,
    latitude        numeric(10,8),
    longitude       numeric(11,8),
    images          text[],               -- stored as array of data URLs / local paths
    is_available    boolean NOT NULL DEFAULT true,
    created_at      timestamp DEFAULT now(),
    updated_at      timestamp DEFAULT now()
);

-- Optional car features (JSON array). Add if missing.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'cars' AND column_name = 'features'
  ) THEN
    ALTER TABLE public.cars ADD COLUMN features jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.bookings (
    id               text PRIMARY KEY DEFAULT gen_random_uuid(),
    car_id           text NOT NULL,
    renter_id        text NOT NULL,
    start_date       timestamp NOT NULL,
    end_date         timestamp NOT NULL,
    start_time       text NOT NULL,
    end_time         text NOT NULL,
    total_amount     numeric(10,2) NOT NULL,
    service_fee      numeric(10,2) NOT NULL,
    insurance        numeric(10,2) NOT NULL,
    status           text NOT NULL DEFAULT 'pending',   -- 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
    message          text,
    payment_status   text NOT NULL DEFAULT 'pending',   -- 'pending' | 'paid' | 'failed' | 'refunded'
    payment_intent_id text,
    created_at       timestamp DEFAULT now(),
    updated_at       timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id           text PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id   text NOT NULL,
    reviewer_id  text NOT NULL,
    reviewee_id  text NOT NULL,
    car_id       text NOT NULL,
    rating       integer NOT NULL,
    comment      text,
    created_at   timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id            text PRIMARY KEY,
    user_id       text NOT NULL,
    type          text NOT NULL,       -- 'booking' | 'payment' | 'review' | 'system' | 'promotion'
    title         text NOT NULL,
    message       text NOT NULL,
    data          text,
    is_read       boolean NOT NULL DEFAULT false,
    is_push_sent  boolean NOT NULL DEFAULT false,
    related_id    text,
    created_at    timestamp DEFAULT now(),
    read_at       timestamp
);

-- Optional car_images table (if you want file metadata storage)
CREATE TABLE IF NOT EXISTS public.car_images (
    id             text PRIMARY KEY,
    car_id         text NOT NULL,
    url            text NOT NULL,
    filename       text NOT NULL,
    original_name  text NOT NULL,
    size           integer NOT NULL,
    mime_type      text NOT NULL,
    is_primary     boolean NOT NULL DEFAULT false,
    created_at     timestamp DEFAULT now()
);

-- =======================
-- Messaging (Conversations & Messages)
-- =======================

CREATE TABLE IF NOT EXISTS public.conversations (
    id              text PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id      text NOT NULL,
    owner_id        text NOT NULL,
    renter_id       text NOT NULL,
    last_message_at timestamp DEFAULT now(),
    created_at      timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id              text PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id text NOT NULL,
    sender_id       text NOT NULL,
    content         text NOT NULL,
    message_type    text NOT NULL DEFAULT 'text', -- 'text' | 'image' | 'file'
    is_read         boolean NOT NULL DEFAULT false,
    created_at      timestamp DEFAULT now()
);

-- =======================
-- Foreign Keys
-- =======================

ALTER TABLE IF EXISTS public.cars
  ADD CONSTRAINT cars_owner_id_fkey
  FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.bookings
  ADD CONSTRAINT bookings_car_id_fkey
  FOREIGN KEY (car_id) REFERENCES public.cars(id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.bookings
  ADD CONSTRAINT bookings_renter_id_fkey
  FOREIGN KEY (renter_id) REFERENCES public.users(id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.reviews
  ADD CONSTRAINT reviews_booking_id_fkey
  FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.reviews
  ADD CONSTRAINT reviews_car_id_fkey
  FOREIGN KEY (car_id) REFERENCES public.cars(id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.reviews
  ADD CONSTRAINT reviews_reviewee_id_fkey
  FOREIGN KEY (reviewee_id) REFERENCES public.users(id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.reviews
  ADD CONSTRAINT reviews_reviewer_id_fkey
  FOREIGN KEY (reviewer_id) REFERENCES public.users(id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.car_images
  ADD CONSTRAINT car_images_car_id_cars_id_fk
  FOREIGN KEY (car_id) REFERENCES public.cars(id) ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.conversations
  ADD CONSTRAINT conversations_booking_id_fk
  FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.messages
  ADD CONSTRAINT messages_conversation_id_fk
  FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON UPDATE NO ACTION ON DELETE NO ACTION;

-- =======================
-- Indexes (performance)
-- =======================

CREATE INDEX IF NOT EXISTS idx_users_email           ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type       ON public.users(user_type);

CREATE INDEX IF NOT EXISTS idx_cars_owner_id         ON public.cars(owner_id);
CREATE INDEX IF NOT EXISTS idx_cars_city             ON public.cars(city);
CREATE INDEX IF NOT EXISTS idx_cars_available        ON public.cars(is_available);
CREATE INDEX IF NOT EXISTS idx_cars_price            ON public.cars(price_per_day);
CREATE INDEX IF NOT EXISTS idx_cars_fuel_type        ON public.cars(fuel_type);

CREATE INDEX IF NOT EXISTS idx_bookings_car_id       ON public.bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter_id    ON public.bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status       ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_start_date   ON public.bookings(start_date);

CREATE INDEX IF NOT EXISTS idx_reviews_car_id        ON public.reviews(car_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id   ON public.reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id   ON public.reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating        ON public.reviews(rating);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type    ON public.notifications(type);

CREATE INDEX IF NOT EXISTS idx_conversations_booking ON public.conversations(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation  ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at    ON public.messages(created_at);

COMMIT;






