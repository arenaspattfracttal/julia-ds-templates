import { defineComponent } from "../types"
import {
  Avatar, AvatarImage, AvatarFallback,
  AvatarBadge, AvatarGroup, AvatarGroupCount,
} from "@/components/ui/avatar"

export const avatarEntry = defineComponent<{
  size: "sm" | "default" | "lg"
  type: string
  withImage: boolean
  fallback: string
  showBadge: boolean
}>({
  id: "avatar",
  name: "Avatar",
  description: {
    en: "An image element with a fallback for representing a user.",
    es: "Un elemento de imagen con fallback para representar a un usuario.",
  },
  category: "Components",
  filePath: "components/ui/avatar.tsx",
  controls: {
    size:      { type: "select",  options: ["sm","default","lg"], defaultValue: "default" },
    type:      { type: "select",  options: ["single","group"],    defaultValue: "single" },
    withImage: { type: "boolean", defaultValue: false },
    fallback:  { type: "text",    defaultValue: "JD" },
    showBadge: { type: "boolean", defaultValue: false },
  },
  render: (props) => {
    const { size, type, withImage, fallback, showBadge } = props
    const fb = fallback || "JD"
    const imgSrcs = [
      "https://i.pravatar.cc/150?img=12",
      "https://i.pravatar.cc/150?img=34",
      "https://i.pravatar.cc/150?img=56",
      "https://i.pravatar.cc/150?img=78",
    ]
    const initials = ["JD","AB","KL","MN"]

    if (type === "group") {
      return (
        <AvatarGroup>
          {initials.map((init, i) => (
            <Avatar key={`${init}-${withImage}`} size={size}>
              {withImage && <AvatarImage src={imgSrcs[i]} alt={init} />}
              <AvatarFallback>{init}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
      )
    }

    return (
      <Avatar key={String(withImage)} size={size}>
        {withImage && <AvatarImage src={imgSrcs[0]} alt={fb} />}
        <AvatarFallback>{fb}</AvatarFallback>
        {showBadge && <AvatarBadge />}
      </Avatar>
    )
  },
  generateCode: (props) => {
    const { size, type, withImage, fallback, showBadge } = props
    const fb = fallback || "JD"
    const sizeAttr = size !== "default" ? ` size="${size}"` : ""
    const imgTag = withImage ? `\n  <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="${fb}" />` : ""
    const badgeTag = showBadge && type === "single" ? `\n  <AvatarBadge />` : ""

    if (type === "group") {
      const initials = ["JD","AB","KL","MN"]
      const imgSrcs  = ["https://i.pravatar.cc/150?img=12","https://i.pravatar.cc/150?img=34","https://i.pravatar.cc/150?img=56","https://i.pravatar.cc/150?img=78"]
      const avatars = initials.map((init, i) => {
        const img = withImage ? `\n    <AvatarImage src="${imgSrcs[i]}" alt="${init}" />` : ""
        return `  <Avatar${sizeAttr}>${img}\n    <AvatarFallback>${init}</AvatarFallback>\n  </Avatar>`
      }).join("\n")
      const body = `<AvatarGroup>\n${avatars}\n  <AvatarGroupCount>+3</AvatarGroupCount>\n</AvatarGroup>`
      const indented = body.split("\n").map(l=>`    ${l}`).join("\n")
      const named = withImage
        ? "Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount"
        : "Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount"
      return `import { ${named} } from "@/components/ui/avatar"\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
    }

    const body = `<Avatar${sizeAttr}>${imgTag}\n  <AvatarFallback>${fb}</AvatarFallback>${badgeTag}\n</Avatar>`
    const indented = body.split("\n").map(l=>`    ${l}`).join("\n")
    const parts = ["Avatar", withImage && "AvatarImage", "AvatarFallback", showBadge && "AvatarBadge"].filter(Boolean).join(", ")
    return `import { ${parts} } from "@/components/ui/avatar"\n\nexport default function Example() {\n  return (\n${indented}\n  )\n}`
  },
})
