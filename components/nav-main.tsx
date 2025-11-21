"use client"

import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Separator } from "./ui/separator"

export type NavItem =
  | {
      type?: "item" // opcional para compatibilidad con código existente
      title: string
      url: string
      icon: LucideIcon
      isActive?: boolean
    }
  | {
      type: "separator"
      key?: string
    }

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item, index) => {
          // Si es separator, renderizamos una línea separadora
          if (item.type === "separator") {
            return (
              <SidebarMenuItem key={item.key ?? `sep-${index}`} aria-hidden>
                <Separator className="my-2" />
              </SidebarMenuItem>
            )
          }

          // Tratamos como item por defecto (tipo "item" o undefined)
          return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {/* ...existing code for subitems (si los activas más adelante) */}
              </SidebarMenuItem>

          )
        })}
        {/* {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))} */}
      </SidebarMenu>
    </SidebarGroup>
  )
}
