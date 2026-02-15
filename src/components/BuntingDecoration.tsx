import bunting from 'assets/bunting';

export function BuntingDecoration() {
  return (
    <div 
      className="w-full h-4 bg-repeat-x bg-center absolute"
      style={{
        backgroundImage: `url(${bunting})`,
        backgroundSize: 'auto 100%'
      }}
    />
  );
}