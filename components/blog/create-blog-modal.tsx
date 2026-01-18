"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface CreateBlogModalProps {
  isOpen: boolean
  onClose: () => void
}

interface CreateBlogPayload {
  title: string
  description: string
  category: string[]
  content: string
  coverImage: string
  date: string
}

export default function CreateBlogModal({ isOpen, onClose }: CreateBlogModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categories: "",
    content: "",
    coverImage: "",
  })

  const mutation = useMutation({
    mutationFn: async (data: CreateBlogPayload) => {
      const response = await fetch("http://localhost:3001/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to create blog")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      toast({
        title: "Success",
        description: "Article published successfully!",
      })
      setFormData({
        title: "",
        description: "",
        categories: "",
        content: "",
        coverImage: "",
      })
      onClose()
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const categoryArray = formData.categories
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)

    if (!formData.title || !formData.description || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    mutation.mutate({
      title: formData.title,
      description: formData.description,
      category: categoryArray,
      content: formData.content,
      coverImage: formData.coverImage || "https://via.placeholder.com/800x400",
      date: new Date().toISOString(),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-3xl bg-card/40 backdrop-blur border-purple-500/30">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-3xl font-serif font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
            Create New Article
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Share your thoughts with the world. Fill in the details and let your voice be heard.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold text-foreground">
              Title <span className="text-purple-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Write an engaging title..."
              className="rounded-xl bg-background/50 border-purple-500/30 text-foreground placeholder:text-muted-foreground/40 h-11 focus:border-purple-500/60 focus:ring-purple-500/30 transition-colors duration-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold text-foreground">
              Description <span className="text-purple-500">*</span>
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief summary of your article..."
              className="rounded-xl bg-background/50 border-purple-500/30 text-foreground placeholder:text-muted-foreground/40 h-11 focus:border-purple-500/60 focus:ring-purple-500/30 transition-colors duration-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories" className="text-base font-semibold text-foreground">
              Categories
            </Label>
            <Input
              id="categories"
              value={formData.categories}
              onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
              placeholder="e.g., Technology, Design, Business"
              className="rounded-xl bg-background/50 border-purple-500/30 text-foreground placeholder:text-muted-foreground/40 h-11 focus:border-purple-500/60 focus:ring-purple-500/30 transition-colors duration-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-base font-semibold text-foreground">
              Content <span className="text-purple-500">*</span>
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your article content here..."
              className="rounded-xl bg-background/50 border-purple-500/30 text-foreground placeholder:text-muted-foreground/40 resize-none focus:border-purple-500/60 focus:ring-purple-500/30 transition-colors duration-500"
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage" className="text-base font-semibold text-foreground">
              Cover Image URL
            </Label>
            <Input
              id="coverImage"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="rounded-xl bg-background/50 border-purple-500/30 text-foreground placeholder:text-muted-foreground/40 h-11 focus:border-purple-500/60 focus:ring-purple-500/30 transition-colors duration-500"
            />
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t border-border/30">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={mutation.isPending}
              className="rounded-lg px-6 h-10 bg-transparent border-border/50 hover:bg-card/40 transition-colors duration-500"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-lg px-8 h-10 bg-gradient-to-r from-purple-600 to-purple-700 hover:shadow-xl hover:shadow-purple-600/40 text-white font-semibold transition-all duration-500 hover:-translate-y-1"
            >
              {mutation.isPending ? "Publishing..." : "Publish Article"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
