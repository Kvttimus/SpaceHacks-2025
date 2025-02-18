import SpaceBackground from "@/components/SpaceBackground"
import Header from "@/components/Header"
import DrawingSection from "@/components/DrawingSection"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <SpaceBackground />
      <Header />
      <DrawingSection />
    </main>
  )
}


// "use client"

// import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import SpaceBackground from "@/components/SpaceBackground"
// import { Navigation } from "@/components/Navigation"
// import DrawingSection from "@/components/DrawingSection"
// import { ExploreSection } from "@/components/ExploreSection"
// import { LearnSection } from "@/components/LearnSection"

// export default function Home() {
//   const [activeTab, setActiveTab] = useState("create")

//   return (
//     <main className="min-h-screen flex flex-col relative">
//       <SpaceBackground />
//       <Navigation activeTab={activeTab} onChange={setActiveTab} />

//       <AnimatePresence mode="wait">
//         <motion.div
//           key={activeTab}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           style={{ paddingTop: "4rem" }}
//         >
//           {activeTab === "create" && <DrawingSection />}
//           {activeTab === "explore" && <ExploreSection />}
//           {activeTab === "learn" && <LearnSection />}
//           {activeTab === "gallery" && (
//             <div className="py-24 px-4 text-center text-white">
//               <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
//               <p className="text-gray-400">The gallery feature is under development.</p>
//             </div>
//           )}
//         </motion.div>
//       </AnimatePresence>
//     </main>
//   )
// }


