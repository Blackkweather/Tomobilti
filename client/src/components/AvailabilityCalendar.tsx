import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

interface AvailabilityCalendarProps {
  carId: string;
  bookedDates?: Date[];
  onDateSelect?: (date: Date | undefined) => void;
}

export default function AvailabilityCalendar({ carId, bookedDates = [] }: AvailabilityCalendarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-purple-600" />
          Availability Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <CalendarIcon className="h-12 w-12 text-purple-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Check availability when booking</p>
          <p className="text-sm text-gray-500">Select dates in the booking form to see availability</p>
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
            <span className="text-gray-600">Booked</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
