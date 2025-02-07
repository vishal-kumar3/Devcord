import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

type props = {
  tabs: {
    name: string
    component: React.ReactNode
  }[]
  defaultTab: string
}

const TabSwitcher = ({ tabs, defaultTab }: props) => {
  return (
    <Tabs defaultValue={defaultTab} className="flex-1 bg-back-three">
      <TabsList className="px-4 flex justify-between bg-back-two border border-divider h-nav">
        <div className="flex items-center gap-2">
          <span>Friends</span>
          {tabs.map((tab, index) => (
            <TabsTrigger value={tab.name} key={index}>{tab.name}</TabsTrigger>
          ))}
        </div>
        <div>
          holla man
        </div>
      </TabsList>
      {tabs.map((tab, index) => (
        <TabsContent className="p-4" key={index} value={tab.name}>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default TabSwitcher
