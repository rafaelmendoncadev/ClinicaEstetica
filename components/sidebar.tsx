
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  Users,
  Scissors,
  Package,
  History,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  UserCheck,
  ShoppingBag,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { UserRole } from '@/lib/types'

interface SidebarItem {
  title: string
  href: string
  icon: any
  roles: UserRole[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: [UserRole.ADMIN, UserRole.ESTHETICIAN, UserRole.RECEPTIONIST],
  },
  {
    title: 'Agendamentos',
    href: '/agendamentos',
    icon: CalendarDays,
    roles: [UserRole.ADMIN, UserRole.ESTHETICIAN, UserRole.RECEPTIONIST],
  },
  {
    title: 'Pacientes',
    href: '/pacientes',
    icon: Users,
    roles: [UserRole.ADMIN, UserRole.ESTHETICIAN, UserRole.RECEPTIONIST],
  },
  {
    title: 'Procedimentos',
    href: '/procedimentos',
    icon: Scissors,
    roles: [UserRole.ADMIN, UserRole.ESTHETICIAN],
  },
  {
    title: 'Produtos',
    href: '/produtos',
    icon: Package,
    roles: [UserRole.ADMIN, UserRole.ESTHETICIAN],
  },
  {
    title: 'Histórico',
    href: '/historico',
    icon: History,
    roles: [UserRole.ADMIN, UserRole.ESTHETICIAN, UserRole.RECEPTIONIST],
  },
  {
    title: 'Estoque',
    href: '/estoque',
    icon: ShoppingBag,
    roles: [UserRole.ADMIN, UserRole.ESTHETICIAN],
  },
  {
    title: 'Financeiro',
    href: '/financeiro',
    icon: DollarSign,
    roles: [UserRole.ADMIN],
  },
  {
    title: 'Relatórios',
    href: '/relatorios',
    icon: BarChart3,
    roles: [UserRole.ADMIN],
  },
  {
    title: 'Usuários',
    href: '/usuarios',
    icon: UserCheck,
    roles: [UserRole.ADMIN],
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const session = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  const userRole = (session?.data?.user?.role as UserRole) || 'RECEPTIONIST'

  const filteredItems = mounted ? sidebarItems.filter(item => 
    item.roles.includes(userRole)
  ) : []

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!isCollapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-semibold text-primary"
            >
              Clínica Estética
            </motion.h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.title}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t p-4">
          {!isCollapsed && session?.data?.user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 text-xs text-muted-foreground"
            >
              <div className="font-medium text-foreground">{session.data.user.name}</div>
              <div>{session.data.user.email}</div>
              <div className="mt-1 capitalize">{session.data.user?.role?.toLowerCase()}</div>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "sm"}
            onClick={handleSignOut}
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
