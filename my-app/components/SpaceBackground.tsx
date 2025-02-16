export default function SpaceBackground() {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-black to-indigo-900 z-[-1]">
        <div className="absolute inset-0 bg-[url('/stars.png')] opacity-50"></div>
      </div>
    )
  }
  
  