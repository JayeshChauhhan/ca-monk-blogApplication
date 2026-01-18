"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import BlogList from "@/components/blog/blog-list"
import BlogDetail from "@/components/blog/blog-detail"
import CreateBlogModal from "@/components/blog/create-blog-modal"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen } from "lucide-react"

const queryClient = new QueryClient()

export default function Home() {
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <header className="sticky top-0 z-50 border-b border-border/20 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 bg-gradient-to-b from-background via-background to-transparent">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div className="space-y-1 group cursor-pointer">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 via-purple-600 to-amber-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-500">
                CA Monk
              </h1>
              <div className="h-1 w-0 group-hover:w-20 bg-gradient-to-r from-purple-500 to-amber-400 rounded-full transition-all duration-500" />
              <p className="text-sm text-muted-foreground font-light tracking-wide">Explore insights and stories</p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:shadow-2xl hover:shadow-purple-600/40 text-white rounded-full px-8 h-12 font-semibold transition-all duration-500 hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" />
              New Article
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-32 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
                <div className="mb-8 space-y-2">
                  <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-purple-500 to-amber-400 bg-clip-text text-transparent">
                    Latest Articles
                  </h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-amber-400 rounded-full" />
                </div>
                <BlogList onSelectBlog={setSelectedBlogId} selectedBlogId={selectedBlogId} />
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedBlogId ? (
                <BlogDetail blogId={selectedBlogId} />
              ) : (
                <div className="flex items-center justify-center h-96 bg-card/50 backdrop-blur rounded-3xl border border-border/40">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-amber-400/20">
                      <BookOpen className="w-8 h-8 text-purple-500" />
                    </div>
                    <p className="text-2xl font-serif font-semibold text-foreground">Select an article</p>
                    <p className="text-muted-foreground">Choose from the list to begin reading</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <CreateBlogModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      </div>
    </QueryClientProvider>
  )
}
