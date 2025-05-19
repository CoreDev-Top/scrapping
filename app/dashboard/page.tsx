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
import { ClubIcon as GolfIcon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [date, setDate] = useState<Date>(() => new Date());
  const [course, setCourse] = useState("San Diego");
  const [position, setPosition] = useState<{ lat: number; lon: number }>({
    lat: 32.71571,
    lon: -117.16472,
  });
  const [players, setPlayers] = useState("0");
  const [holes, setHoles] = useState("3");
  const [timeRange, setTimeRange] = useState([5, 21]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [teeTimes, setTeeTimes] = useState<any>(null);
  const [teeTimesLoading, setTeeTimesLoading] = useState(false);
  const supabase = getSupabase();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    getCourseInfoApi(course);
  }, [course]);

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

  // Pre-calculate disabled dates
  const disabledDates = useMemo(() => {
    const dates: Date[] = [];
    const currentDate = new Date(Date.UTC(2025, 4, 19));
    const startDate = new Date(Date.UTC(2025, 0, 1));
    let date = new Date(startDate);
    while (date < currentDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }, []);

  // Handle time range change
  const handleTimeRangeChange = (values: number[]) => {
    setTimeRange(values);
  };

  const getCourseInfoApi = async (value: string) => {
    try {
      const response = await fetch(
        `/api/teeoff?city=${encodeURIComponent(value)}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.hits.length > 0) {
        setPosition(data.hits[0].geo);
      }

      if (data.ttResults?.facilities?.length > 0) {
        const facilities = data.ttResults.facilities;
        const tmp: any = [];
        facilities.forEach((facility: any) => {
          if (facility.address.city == course) {
            tmp.push({
              courseName: facility.name,
              address: facility.address,
              distance: facility.formattedDistance,
              thumbnailImagePath: facility.thumbnailImagePath,
              teeTimes: (facility.teeTimes || []).map((teeTime: any) => ({
                price: teeTime.price.roundedSuperScriptFormattedValue,
                time: teeTime.time,
                players: teeTime.players,
                holes: teeTime.displayRate?.holeCount,
                detailUrl: teeTime.detailUrl,
              })),
            });
          }
        });
        setTeeTimes(tmp);
      }
    } catch (error) {
      console.error("Error fetching city data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch city data. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Define the function to call the API
    const fetchTeeTimes = async () => {
      setTeeTimesLoading(true);
      try {
        const response = await fetch("/api/tee-times", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            // Replace with your actual body data
            Radius: 100,
            Latitude: position.lat,
            Longitude: position.lon,
            PageSize: 30,
            PageNumber: 0,
            SearchType: 4,
            SortBy: "Facilities.Distance",
            SortDirection: 0,
            Date: "May 21 2025",
            HotDealsOnly: true,
            PriceMin: 0,
            PriceMax: 10000,
            Players: players,
            TimePeriod: 3,
            Holes: holes,
            FacilityType: 0,
            RateType: "all",
            TimeMin: 2 * timeRange[0],
            TimeMax: 2 * timeRange[1],
            SortByRollup: "Facilities.Distance",
            View: "Course-Tile",
            ExcludeFeaturedFacilities: false,
            TeeTimeCount: 20,
            PromotedCampaignsOnly: false,
            CurrentClientDate: "2025-05-19T04:00:00.000Z",
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // You can set state here if you want to display the data
        console.log("...." + new Date(), data);
        if (data.ttResults.facilities.length) {
          const facilities = data.ttResults.facilities;
          const tmp: any = [];
          facilities.forEach((facility: any) => {
            if (facility.address.city == course) {
              tmp.push({
                courseName: facility.name,
                address: facility.address,
                distance: facility.formattedDistance,
                thumbnailImagePath: facility.thumbnailImagePath,
                teeTimes: (facility.teeTimes || []).map((teeTime: any) => ({
                  price: teeTime.price.roundedSuperScriptFormattedValue,
                  time: teeTime.time,
                  players: teeTime.players,
                  holes: teeTime.displayRate?.holeCount,
                  detailUrl: teeTime.detailUrl,
                })),
              });
            }
          });
          console.log(tmp);
          setTeeTimes(tmp);
        }
      } catch (error) {
        console.error("Error fetching tee times:", error);
      } finally {
        setTeeTimesLoading(false);
      }
    };

    // Call immediately, then every 1 minute
    fetchTeeTimes();
    // const interval = setInterval(fetchTeeTimes, 10000);
    const interval = setInterval(fetchTeeTimes, 60000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [players, holes, timeRange, position, date]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-800 to-green-950">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!mounted) {
    return null;
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
              <Select value={course} onValueChange={setCourse}>
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
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  disabled={disabledDates}
                  className="rounded-md border-0 w-full"
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Players</h2>
              <div className="grid grid-cols-5 gap-2">
                {["1", "2", "3", "4", "0"].map((num) => (
                  <Button
                    key={num}
                    variant={players === num ? "default" : "outline"}
                    className={
                      players === num ? "bg-green-600 hover:bg-green-700" : ""
                    }
                    onClick={() => setPlayers(num)}
                  >
                    {num != "0" ? num : "any"}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-2">Time of Day</h2>
              <div className="px-2">
                <Slider
                  value={timeRange}
                  min={5}
                  max={21}
                  step={1}
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
                  <SelectItem value="3">any</SelectItem>
                  <SelectItem value="1">9 Holes</SelectItem>
                  <SelectItem value="2">18 Holes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tee Times Section */}
          <div className="pl-8" style={{ width: "-webkit-fill-available" }}>
            <div>
              <h2 className="text-xl font-bold mb-4">
                Tee Times{" "}
                <span className="font-normal text-gray-500">{course}</span>
              </h2>
              {teeTimesLoading ? (
                <div className="flex justify-center items-center h-40">
                  <svg
                    className="animate-spin h-8 w-8 text-green-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  <span className="ml-2 text-green-700 font-medium">
                    Loading tee times...
                  </span>
                </div>
              ) : teeTimes && teeTimes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {teeTimes.map((teeTime: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-lg border-t-4 border-green-600 flex flex-col overflow-hidden hover:shadow-2xl transition-shadow"
                    >
                      {teeTime.thumbnailImagePath && (
                        <img
                          src={teeTime.thumbnailImagePath}
                          alt={teeTime.courseName}
                          className="h-32 w-full object-cover"
                        />
                      )}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-green-800">
                            {teeTime.courseName}
                          </h3>
                          <div className="text-sm text-gray-600">
                            {teeTime.address.city},{" "}
                            {teeTime.address.stateProvince} {teeTime.address.postalCode}
                            {" · "}Distance: <b>{teeTime.distance}</b>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-3">
                            {teeTime.teeTimes && teeTime.teeTimes.length > 0 && teeTime.teeTimes.map((detail: any, i: number) => (
                              <div
                                key={i}
                                className="bg-white border rounded-lg shadow flex flex-col items-center px-4 py-2 min-w-[110px]"
                                style={{ minWidth: 110 }}
                              >
                                <div className="text-green-800 font-bold text-lg" dangerouslySetInnerHTML={{ __html: detail.price || "" }} />
                                <div className="font-semibold text-sm mt-1">{detail.time}</div>
                                <div className="text-xs text-gray-500 mb-1">
                                  {detail.players >=4?"1-4":detail.players} Players
                                </div>
                                <div className="text-xs text-blue-700 font-bold mb-1">
                                  {detail.holes ? `${detail.holes} Holes` : ""}
                                </div>
                                <a
                                  href={`https://www.teeoff.com/${detail.detailUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition"
                                >
                                  Book
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No tee times found.</div>
              )}
            </div>
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
            <p>&copy; 2025 Tee Time Radar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
