import { Button } from "@/components/ui/button"


function dummy(){
console.log("deneme")
}

function App() {
  
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button onClick={dummy} variant="outline">Click me</Button>
    </div>
  )
}

export default App
