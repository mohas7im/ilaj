"use client"

import { useState } from "react"
import { useEditor, useEditorState, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link2,
  Undo2,
  Redo2,
} from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Separator } from "@/components/admin/ui/separator"
import { Toggle } from "@/components/admin/ui/toggle"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/admin/ui/popover"
import { toRichTextHtml } from "@/lib/rich-text"
import { cn } from "@/lib/utils"

type RichTextEditorProps = {
  /** HTML (or legacy plain text) to start with */
  value: string
  /** Called with the editor HTML, or "" when the editor is empty */
  onChange: (html: string) => void
  id?: string
  "aria-labelledby"?: string
  className?: string
}

// Toolbar only offers what the website's .rich-text styles support.
// server/lib/sanitize.ts allows exactly these tags.
export function RichTextEditor({
  value,
  onChange,
  id,
  "aria-labelledby": ariaLabelledBy,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
    ],
    content: toRichTextHtml(value),
    // Rendered on the server first; create the editor after hydration
    immediatelyRender: false,
    editorProps: {
      attributes: {
        ...(id && { id }),
        ...(ariaLabelledBy && { "aria-labelledby": ariaLabelledBy }),
        "aria-multiline": "true",
        role: "textbox",
        class: "admin-rich-text min-h-48 px-2.5 py-2 text-base md:text-sm outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  })

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-input transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
        className
      )}
    >
      {editor ? (
        <>
          <Toolbar editor={editor} />
          <EditorContent editor={editor} />
        </>
      ) : (
        // Same size as the loaded editor, so the form doesn't jump
        <div aria-hidden="true">
          <div className="h-9 border-b" />
          <div className="min-h-48" />
        </div>
      )}
    </div>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  // Re-render the toolbar only when these values change
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      h2: editor.isActive("heading", { level: 2 }),
      h3: editor.isActive("heading", { level: 3 }),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      blockquote: editor.isActive("blockquote"),
      link: editor.isActive("link"),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  })

  const chain = () => editor.chain().focus()

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex flex-wrap items-center gap-0.5 border-b p-1"
    >
      <ToolbarToggle label="Bold" pressed={state.bold} onClick={() => chain().toggleBold().run()}>
        <Bold />
      </ToolbarToggle>
      <ToolbarToggle label="Italic" pressed={state.italic} onClick={() => chain().toggleItalic().run()}>
        <Italic />
      </ToolbarToggle>
      <ToolbarToggle label="Underline" pressed={state.underline} onClick={() => chain().toggleUnderline().run()}>
        <Underline />
      </ToolbarToggle>

      <Separator orientation="vertical" className="mx-1 my-1" />

      <ToolbarToggle label="Heading" pressed={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
        <Heading2 />
      </ToolbarToggle>
      <ToolbarToggle label="Subheading" pressed={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
        <Heading3 />
      </ToolbarToggle>

      <Separator orientation="vertical" className="mx-1 my-1" />

      <ToolbarToggle label="Bullet list" pressed={state.bulletList} onClick={() => chain().toggleBulletList().run()}>
        <List />
      </ToolbarToggle>
      <ToolbarToggle label="Numbered list" pressed={state.orderedList} onClick={() => chain().toggleOrderedList().run()}>
        <ListOrdered />
      </ToolbarToggle>
      <ToolbarToggle label="Quote" pressed={state.blockquote} onClick={() => chain().toggleBlockquote().run()}>
        <Quote />
      </ToolbarToggle>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title="Divider"
        aria-label="Divider"
        onClick={() => chain().setHorizontalRule().run()}
      >
        <Minus />
      </Button>

      <Separator orientation="vertical" className="mx-1 my-1" />

      <LinkControl editor={editor} active={state.link} />

      <div className="ml-auto flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          title="Undo"
          aria-label="Undo"
          disabled={!state.canUndo}
          onClick={() => chain().undo().run()}
        >
          <Undo2 />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          title="Redo"
          aria-label="Redo"
          disabled={!state.canRedo}
          onClick={() => chain().redo().run()}
        >
          <Redo2 />
        </Button>
      </div>
    </div>
  )
}

function ToolbarToggle({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string
  pressed: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Toggle
      size="sm"
      title={label}
      aria-label={label}
      pressed={pressed}
      onPressedChange={onClick}
    >
      {children}
    </Toggle>
  )
}

function LinkControl({ editor, active }: { editor: Editor; active: boolean }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")

  const handleOpenChange = (next: boolean) => {
    // Start from the link under the cursor, if any
    if (next) setUrl(editor.getAttributes("link").href ?? "")
    setOpen(next)
  }

  const apply = () => {
    const href = url.trim()
    const chain = editor.chain().focus().extendMarkRange("link")
    if (href) chain.setLink({ href }).run()
    else chain.unsetLink().run()
    setOpen(false)
  }

  const remove = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={<Toggle size="sm" pressed={active} />}
        title="Link"
        aria-label="Link"
      >
        <Link2 />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        {/* Not a <form>: this sits inside the service form */}
        <div className="flex flex-col gap-2">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                apply()
              }
            }}
            placeholder="https://example.com"
            aria-label="Link URL"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            {active && (
              <Button type="button" variant="ghost" size="sm" onClick={remove}>
                Remove link
              </Button>
            )}
            <Button type="button" size="sm" onClick={apply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
