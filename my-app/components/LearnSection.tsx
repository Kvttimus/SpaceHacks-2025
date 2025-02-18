// "use client"

// import { motion } from "framer-motion"
// import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// const topics = {
//   constellations: [
//     {
//       title: "Ursa Major",
//       description:
//         "The Great Bear constellation contains the Big Dipper and is visible year-round in the Northern Hemisphere.",
//     },
//     {
//       title: "Orion",
//       description: "One of the most recognizable constellations, Orion the Hunter is best visible in winter months.",
//     },
//     {
//       title: "Cassiopeia",
//       description:
//         "Named after a vain queen in Greek mythology, this W-shaped constellation is circumpolar in the Northern Hemisphere.",
//     },
//   ],
//   planets: [
//     {
//       title: "Mars",
//       description:
//         "The Red Planet has the largest volcano in the solar system, Olympus Mons, standing at 21.9 km high.",
//     },
//     {
//       title: "Jupiter",
//       description: "Jupiter's Great Red Spot is a giant storm that has been raging for at least 400 years.",
//     },
//     {
//       title: "Saturn",
//       description:
//         "Saturn's rings are made mostly of water ice and rock, ranging from tiny particles to boulder-sized chunks.",
//     },
//   ],
//   galaxies: [
//     {
//       title: "Andromeda",
//       description:
//         "Our nearest major galaxy neighbor, Andromeda will collide with the Milky Way in about 4.5 billion years.",
//     },
//     {
//       title: "Triangulum",
//       description: "The third-largest galaxy in our Local Group, containing about 40 billion stars.",
//     },
//     {
//       title: "Sombrero",
//       description: "Named for its hat-like shape, this galaxy contains about 100 billion stars.",
//     },
//   ],
// }

// export function LearnSection() {
//   return (
//     <div className="py-24 px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         style={{ maxWidth: "64rem", margin: "0 auto" }}
//       >
//         <h2 className="text-3xl font-bold text-white text-center mb-8">Celestial Knowledge</h2>
//         <Tabs defaultValue="constellations" className="w-full">
//           <TabsList className="w-full justify-center bg-white/5 border border-white/10">
//             <TabsTrigger value="constellations">Constellations</TabsTrigger>
//             <TabsTrigger value="planets">Planets</TabsTrigger>
//             <TabsTrigger value="galaxies">Galaxies</TabsTrigger>
//           </TabsList>
//           {(Object.keys(topics) as Array<keyof typeof topics>).map((topic) => (
//             <TabsContent key={topic} value={topic}>
//               <div className="grid gap-4">
//                 {topics[topic].map((item, index) => (
//                   <motion.div
//                     key={item.title}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     <Card className="bg-white/5 border-white/10">
//                       <CardHeader>
//                         <CardTitle className="text-white">{item.title}</CardTitle>
//                         <CardDescription className="text-gray-400">{item.description}</CardDescription>
//                       </CardHeader>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </div>
//             </TabsContent>
//           ))}
//         </Tabs>
//       </motion.div>
//     </div>
//   )
// }

