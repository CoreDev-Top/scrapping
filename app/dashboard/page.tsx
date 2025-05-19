"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { getSupabase } from "@/lib/supabase";
import {
  ChevronLeft,
  ChevronRight,
  ClubIcon as GolfIcon,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date(2025, 4, 19)); // May 19, 2025
  const [course, setCourse] = useState("San Diego");
  const [position, setPosition] = useState({});
  const [players, setPlayers] = useState("0");
  const [holes, setHoles] = useState("");
  const [timeRange, setTimeRange] = useState([10, 42]); // 5am to 9pm
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();
  const api = "https://www.teeoff.com/api/tee-times/tee-time-results";

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data?.session?.user) {
          setUser(data.session.user);
        } else {
          router.push("/login");
        }
      } catch (error: any) {
        console.error("Auth error:", error);
        toast({
          title: "Authentication error",
          description: error.message || "Please sign in again.",
          variant: "destructive",
        });
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.push("/login");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to disable past dates
  const isPastDate = (date: Date) => {
    const currentDate = new Date(2025, 4, 19); // May 19, 2025
    return date < currentDate;
  };

  // Handle time range change
  const handleTimeRangeChange = (values: number[]) => {
    setTimeRange(values);
  };

  const getCourseInfoApi = async (value: string) => {
    const res = await fetch(`/lib/cityApi?city=${encodeURIComponent(value)}`);
    const data = await res.json();
    console.log(data);
    setCourse(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-800 to-green-950">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-green-800 text-white p-4">
        <div className="mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GolfIcon className="h-6 w-6" />
            <h1 className="text-xl font-bold">Tee Time Radar</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span>{user?.email}</span>
            <Button
              variant="ghost"
              className="text-white hover:bg-green-700"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <div className="flex">
          {/* Filters Section */}
          <div
            className="space-y-6 border rounded-lg p-4 bg-white shadow-sm"
            style={{ width: 328 }}
          >
            <div>
              <h2 className="text-lg font-medium mb-2">Course</h2>
              <Select value={course} onValueChange={getCourseInfoApi}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="San Diego">San Diego</SelectItem>
                  <SelectItem value="Seattle">Seattle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Date</h2>
              <div className="border rounded-md overflow-hidden w-full">
                <div className="bg-gray-100 p-2 flex justify-between items-center">
                  <button className="p-1">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="font-medium">May 2025</span>
                  <button className="p-1">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  disabled={isPastDate}
                  className="rounded-md border-0 w-full"
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Players</h2>
              <div className="grid grid-cols-5 gap-2">
                {["1", "2", "3", "4", "Any"].map((num) => (
                  <Button
                    key={num}
                    variant={players === num ? "default" : "outline"}
                    className={
                      players === num ? "bg-green-600 hover:bg-green-700" : ""
                    }
                    onClick={() => setPlayers(num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Time of Day</h2>
              <div className="px-2">
                <Slider
                  value={timeRange}
                  min={10}
                  max={42}
                  step={2}
                  onValueChange={handleTimeRangeChange}
                />
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>{timeRange[0]} am</span>
                  <span>
                    {timeRange[1] > 12
                      ? `${timeRange[1] - 12} pm`
                      : `${timeRange[1]} am`}
                    +
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Holes Selection</h2>
              <Select value={holes} onValueChange={setHoles}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select holes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">any</SelectItem>
                  <SelectItem value="9 Holes">9 Holes</SelectItem>
                  <SelectItem value="18 Holes">18 Holes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tee Times Section */}
          <div className="pl-8" style={{ width: "-webkit-fill-available" }}>
            {/* <div>
              <h2 className="text-xl font-bold mb-4">
                Mid Day{" "}
                <span className="font-normal text-gray-500">
                  {formatDate(date)}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teeTimes.midDay.map((teeTime, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden border-t-4 border-t-green-600"
                  >
                    <CardContent className="p-0">
                      <div className="p-4 bg-white">
                        <h3 className="text-xl font-bold">{teeTime.time}</h3>
                      </div>
                      <div className="p-4 bg-green-800 text-white flex justify-between items-center">
                        <span>
                          {teeTime.holes} HOLES | {teeTime.golfers} GOLFERS
                        </span>
                        <span className="text-xl font-bold">
                          ${teeTime.price.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white p-4 mt-auto">
        <div className="container mx-auto">
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-2">Contact Us</h3>
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@crossingsgolf.com</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Hours</h3>
              <p>Monday - Sunday: 5:00 AM - 9:00 PM</p>
              <p>Pro Shop: 6:00 AM - 8:00 PM</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Address</h3>
              <p>5800 The Crossings Dr</p>
              <p>Carlsbad, CA 92008</p>
            </div>
          </div> */}
          <div className="mt-6 text-center">
            <p>
              &copy; {new Date().getFullYear()} Tee Time Radar. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
