"use client"

import { useQuery } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Blog {
  id: number
  title: string
  description: string
  category: string[]
  date: string
  coverImage: string
}

interface BlogListProps {
  onSelectBlog: (id: number) => void
  selectedBlogId: number | null
}

export default function BlogList({ onSelectBlog, selectedBlogId }: BlogListProps) {
  const {
    data: blogs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/blogs")
      if (!response.ok) throw new Error("Failed to fetch blogs")
      return response.json()
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load articles. Ensure JSON Server is running on port 3001.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {blogs?.map((blog: Blog) => (
        <Card
          key={blog.id}
          className={`p-6 cursor-pointer group overflow-hidden rounded-2xl transition-all duration-500 ${
            selectedBlogId === blog.id
              ? "bg-gradient-to-br from-purple-600/20 via-card to-purple-500/10 border-purple-500/60 shadow-xl shadow-purple-600/20"
              : "border-border/40 bg-card/30 hover:bg-card/60 hover:border-purple-500/40 hover:shadow-lg hover:-translate-x-1"
          }`}
          onClick={() => onSelectBlog(blog.id)}
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-purple-400 transition-colors duration-500 line-clamp-2 flex-1">
                {blog.title}
              </h3>
              <ArrowRight className="w-5 h-5 text-purple-500/60 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-500 flex-shrink-0 mt-1" />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{blog.description}</p>

            <div className="flex gap-2 flex-wrap pt-2">
              {blog.category?.slice(0, 2).map((cat) => (
                <Badge
                  key={cat}
                  className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/40 transition-colors duration-500"
                >
                  {cat}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/20">
              <p className="text-xs text-muted-foreground/70 font-medium">{new Date(blog.date).toLocaleDateString()}</p>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-amber-400" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
