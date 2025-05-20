"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

type Course = {
  id: number
  name: string
}

interface CourseSelectProps {
  selectedCourseIds: number[]
  onChange: (courseIds: number[]) => void
}

export function CourseSelect({ selectedCourseIds, onChange }: CourseSelectProps) {
  const [open, setOpen] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase.from("courses").select("id, name").order("name")

        if (error) throw error
        setCourses(data || [])
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const toggleCourse = (courseId: number) => {
    if (selectedCourseIds.includes(courseId)) {
      onChange(selectedCourseIds.filter((id) => id !== courseId))
    } else {
      onChange([...selectedCourseIds, courseId])
    }
  }

  const selectedCourses = courses.filter((course) => selectedCourseIds.includes(course.id))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10"
        >
          {selectedCourses.length > 0 ? (
            <div className="flex flex-wrap gap-1 py-1">
              {selectedCourses.map((course) => (
                <Badge key={course.id} variant="secondary">
                  {course.name}
                </Badge>
              ))}
            </div>
          ) : (
            "Select courses..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search courses..." />
          <CommandList>
            <CommandEmpty>No course found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {loading ? (
                <div className="py-6 text-center text-sm">Loading courses...</div>
              ) : (
                courses.map((course) => (
                  <CommandItem
                    key={course.id}
                    value={course.name}
                    onSelect={() => {
                      toggleCourse(course.id)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCourseIds.includes(course.id) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {course.name}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
