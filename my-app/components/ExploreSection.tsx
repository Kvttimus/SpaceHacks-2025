// "use client"

// import { motion } from "framer-motion"
// import { SpaceIcon as GalaxyIcon, Rocket, Satellite, Stars } from "lucide-react"

// const facts = [
//   {
//     icon: Stars,
//     title: "Cosmic Scale",
//     description: "The observable universe is about 93 billion light-years in diameter.",
//   },
//   {
//     icon: GalaxyIcon,
//     title: "Galactic Wonder",
//     description: "Our Milky Way contains over 100 billion stars and at least that many planets.",
//   },
//   {
//     icon: Satellite,
//     title: "Space Observation",
//     description: "The James Webb Space Telescope can see objects 100 times fainter than Hubble.",
//   },
//   {
//     icon: Rocket,
//     title: "Space Exploration",
//     description: "Humans have visited the Moon 6 times, with plans to return by 2025.",
//   },
// ]

// export function ExploreSection() {
//   return (
//     <div className="py-24 px-4">
//       <div className="max-w-4xl mx-auto text-center">
//         <h2 className="text-3xl font-bold text-white mb-8">Explore the Cosmos</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {facts.map((fact, index) => (
//             <motion.div
//               key={fact.title}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               style={{ position: "relative" }}
//               className="group p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
//             >
//               <motion.div
//                 className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"
//                 style={{ margin: "-2px" }}
//               />
//               <div className="relative flex flex-col items-center gap-4">
//                 <fact.icon className="w-8 h-8 text-purple-400" />
//                 <h3 className="text-xl font-semibold text-white">{fact.title}</h3>
//                 <p className="text-gray-400">{fact.description}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

