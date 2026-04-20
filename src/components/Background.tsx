'use client'

export default function MainBackground() {
  return (
    <div className="fixed inset-0 -z-10">
          <img
            src="/images/BG2.png"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          <img
            src="/images/BG.png"
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
          
          <div
            className="absolute inset-0 w-full h-full z-20 bottom-0"
            style={{  
              background: `linear-gradient(to top, #cebba89a, #ffffff00)`
            }}
          />
    </div>
  );
}

export function OuterBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
          <img
            src="/images/BG2.png"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
    </div>
  );
}

export function InnerBackground() {
  return (
    <>
        <img src="/images/Review.png" 
             className="absolute w-[500px] h-auto z-10 ml-[1000px] mt-[-25px]"/>
        <img src="/images/BG.png" 
             className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"/>
        <div className="absolute inset-0 w-full h-full z-20 pointer-events-none" 
             style={{ background: `linear-gradient(to top, #cebba87a, #ffffff00)` }}/>
    </>
  );
}
