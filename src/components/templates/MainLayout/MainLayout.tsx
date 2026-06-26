interface MainLayoutProps {
  header: React.ReactNode
  children: React.ReactNode
}

export function MainLayout({ header, children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {header}
      <main className="flex-1 container mx-auto px-4 py-5 max-w-screen-xl">
        {children}
      </main>
    </div>
  )
}
