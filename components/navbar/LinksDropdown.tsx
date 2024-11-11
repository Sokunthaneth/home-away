import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LuAlignLeft } from "react-icons/lu";
import Link from "next/link";
import { Button } from "../ui/button";
import UserIcon from "./UserIcon";
import { links } from "@/utils/links";
import SignOutLink from "./SignOutLink";
import { User } from "lucide-react";

function LinksDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-4 max-4-[100px]">
          <LuAlignLeft className="w-6 h-6" />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" align="start" sideOffset={10}>
        {links.map((link) => {
          return (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href} className="capitalize w-full">
                {link.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LinksDropdown;