import { useEffect, useState } from 'react';

const Crosshair = ({ color = '#ffffff', containerRef }) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const target = containerRef?.current || window;

    const handleMouseMove = (e) => {
      // Calculate position relative to the container
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setX(e.clientX - rect.left);
        setY(e.clientY - rect.top);
      } else {
        setX(e.clientX);
        setY(e.clientY);
      }
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    // Attach listeners
    target.addEventListener('mousemove', handleMouseMove);
    target.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      target.removeEventListener('mousemove', handleMouseMove);
      target.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef]);

  return (
    <div 
      className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-out"
      style={{ opacity }}
    >
      {/* Vertical Line */}
      <div 
        className="absolute top-0 bottom-0 w-[1px]"
        style={{ 
          left: x, 
          backgroundColor: color,
          opacity: 0.3 // Making it subtle so it doesn't distract
        }} 
      />
      
      {/* Horizontal Line */}
      <div 
        className="absolute left-0 right-0 h-[1px]"
        style={{ 
          top: y, 
          backgroundColor: color, 
          opacity: 0.3 
        }} 
      />

      {/* The Central Cross/Plus */}
      <div 
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2"
        style={{ left: x, top: y }}
      >
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white transform -translate-y-1/2" />
        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white transform -translate-x-1/2" />
      </div>
    </div>
  );
};

export default Crosshair;