interface MainLayoutProps {
  header: React.ReactNode
  children: React.ReactNode
}

export function MainLayout({ header, children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {header}
      {/* pb-24 on mobile gives room for FAB + bottom action bar */}
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-3 sm:py-5 pb-24 md:pb-5 max-w-screen-xl">
        {children}
      </main>
    </div>
  )
}
