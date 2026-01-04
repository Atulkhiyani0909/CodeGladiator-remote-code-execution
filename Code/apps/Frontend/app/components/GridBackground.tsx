export const GridBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute inset-0 bg-[#050505]"></div>
    
    <div className="absolute inset-0" 
         style={{ 
           backgroundImage: `linear-gradient(to right, #1a1a1a 1px, transparent 1px), 
                             linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)`,
           backgroundSize: '40px 40px' 
         }}>
    </div>
   
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]"></div>
  </div>
);