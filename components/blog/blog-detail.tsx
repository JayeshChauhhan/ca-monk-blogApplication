"use client"

import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, BookOpen } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

interface Blog {
  id: number
  title: string
  description: string
  category: string[]
  date: string
  coverImage: string
  content: string
}

interface BlogDetailProps {
  blogId: number
}

export default function BlogDetail({ blogId }: BlogDetailProps) {
  const {
    data: blog,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3001/blogs/${blogId}`)
      if (!response.ok) throw new Error("Failed to fetch blog")
      return response.json()
    },
    enabled: !!blogId,
  })

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-96 w-full rounded-3xl" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load article details.</AlertDescription>
      </Alert>
    )
  }

  if (!blog) {
    return null
  }

  return (
    <article className="space-y-10 animate-in fade-in duration-700">
      <div className="relative h-96 w-full overflow-hidden rounded-3xl group shadow-2xl shadow-purple-600/20 border border-purple-500/20">
        <Image
          src={blog.coverImage || "/placeholder.svg?height=400&width=900&query=blog-cover-premium"}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-serif font-bold leading-tight text-foreground drop-shadow-lg">{blog.title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl font-light">{blog.description}</p>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-500 via-purple-600 to-amber-400 rounded-full" />
        </div>

        <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-border/30">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Published</p>
              <time dateTime={blog.date} className="text-sm font-medium text-foreground">
                {new Date(blog.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Read Time</p>
              <span className="text-sm font-medium text-foreground">
                {Math.ceil(blog.content.split(" ").length / 200)} min
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {blog.category?.map((cat: string) => (
              <Badge
                key={cat}
                className="bg-purple-500/20 text-purple-300 border-purple-500/50 hover:bg-purple-500/40 transition-colors duration-500 font-medium"
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 prose-headings:font-serif prose-headings:text-foreground">
        <div className="bg-card/40 backdrop-blur rounded-3xl p-10 border border-purple-500/20">
          <p className="text-lg leading-8 text-foreground/90 whitespace-pre-wrap font-light">{blog.content}</p>
        </div>
      </div>

      <div className="border-t border-border/30 pt-10">
        <div className="bg-card/50 backdrop-blur rounded-2xl p-8 text-center space-y-4 hover:shadow-2xl transition-shadow duration-500 border border-purple-500/20">
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Enjoyed this article?</p>
          <p className="text-2xl font-serif font-bold text-foreground">Share with your network</p>
        </div>
      </div>
    </article>
  )
}
