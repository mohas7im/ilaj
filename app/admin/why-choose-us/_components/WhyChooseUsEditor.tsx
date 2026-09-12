"use client"

import { useState, useRef } from "react"
import { Plus, Trash2, Upload, ArrowUp, ArrowDown, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import type { WhyChooseUsSection, WhyChooseUsItem } from "../_types/why-choose-us.types"

type WhyChooseUsEditorProps = {
  initialData: WhyChooseUsSection
}

export function WhyChooseUsEditor({ initialData }: WhyChooseUsEditorProps) {
  const [data, setData] = useState<WhyChooseUsSection>(initialData)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTextChange = (key: keyof WhyChooseUsSection, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleItemTitleChange = (id: string, newTitle: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, title: newTitle } : it)),
    }))
    setSaved(false)
  }

  const handleAddItem = () => {
    const newItem: WhyChooseUsItem = {
      id: Date.now().toString(),
      title: "New Feature Highlight",
    }
    setData((prev) => ({ ...prev, items: [...prev.items, newItem] }))
    setSaved(false)
  }

  const handleDeleteItem = (id: string) => {
    setData((prev) => ({ ...prev, items: prev.items.filter((it) => it.id !== id) }))
    setSaved(false)
  }

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= data.items.length) return
    const newItems = [...data.items]
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp
    setData((prev) => ({ ...prev, items: newItems }))
    setSaved(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setData((prev) => ({ ...prev, image: reader.result as string }))
      setSaved(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-8">
      {/* ── Visual Live Preview ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Live Section Preview
          </Label>
          <span className="text-xs text-muted-foreground">Website Preview</span>
        </div>

        <div className="rounded-3xl border bg-card p-6 sm:p-10 lg:p-12 shadow-sm overflow-hidden">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              {/* Badge */}
              <div>
                <span className="inline-block rounded-full border border-border/80 bg-muted/40 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-foreground/80 uppercase select-none">
                  {data.badge || "WHY CHOOSE US"}
                </span>
              </div>

              {/* Headings */}
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground leading-[1.15]">
                  {data.title}{" "}
                  <span className="text-destructive block sm:inline">
                    {data.highlightText}
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
                  {data.description}
                </p>
              </div>

              {/* Numbered Feature List */}
              <ul className="space-y-4 pt-2">
                {data.items.map((item, index) => (
                  <li key={item.id} className="flex items-baseline gap-4 group">
                    <span className="text-sm font-semibold text-destructive font-mono select-none shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base sm:text-lg font-medium text-foreground tracking-tight">
                      {item.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Photo */}
            <div className="relative flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-md rounded-[2.25rem] overflow-hidden border shadow-sm">
                <img
                  src={data.image}
                  alt="Why Choose Us showcase"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Editor Form ── */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* General Section Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Section Headings &amp; Copy</CardTitle>
              <CardDescription>
                Customize the badge, titles, and descriptive subtitle.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="badge">Pill Badge Text</Label>
                <Input
                  id="badge"
                  value={data.badge}
                  onChange={(e) => handleTextChange("badge", e.target.value)}
                  placeholder="e.g. WHY CHOOSE US"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title">Main Heading (Prefix)</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => handleTextChange("title", e.target.value)}
                  placeholder="e.g. What Makes Ilaj"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="highlightText">Highlighted Text (Accent Color)</Label>
                <Input
                  id="highlightText"
                  value={data.highlightText}
                  onChange={(e) => handleTextChange("highlightText", e.target.value)}
                  placeholder="e.g. Dental Care Different"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Section Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => handleTextChange("description", e.target.value)}
                  placeholder="Subtitle explaining your clinic's patient-first approach..."
                  rows={3}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2 pt-2 border-t">
                <Label>Showcase Image</Label>
                <div className="flex items-center gap-3">
                  <img
                    src={data.image}
                    alt="Preview"
                    className="h-16 w-16 rounded-xl object-cover border shrink-0"
                  />
                  <div className="space-y-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-1.5 h-3.5 w-3.5" />
                      Change Photo
                    </Button>
                    <p className="text-[11px] text-muted-foreground">
                      Square (1:1) aspect ratio recommended.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Numbered Feature Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-base">Feature Highlights</CardTitle>
                <CardDescription>
                  Manage the numbered differentiators (01, 02, etc.).
                </CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Point
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2.5 rounded-lg border bg-muted/20"
                >
                  <span className="text-xs font-mono font-bold text-destructive px-1.5 shrink-0 select-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <Input
                    value={item.title}
                    onChange={(e) => handleItemTitleChange(item.id, e.target.value)}
                    placeholder="Feature highlight title"
                    className="h-8 flex-1"
                    required
                  />

                  <div className="flex items-center gap-0.5 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      title="Move up"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      title="Move down"
                      disabled={index === data.items.length - 1}
                      onClick={() => handleMove(index, "down")}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      title="Delete point"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs text-primary font-medium">
              Changes saved successfully!
            </span>
          )}
          <Button type="submit" size="lg">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
