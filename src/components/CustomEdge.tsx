
import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';

const CustomEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
    curvature: 0.8,
  });

  return (
    <>
      <BaseEdge 
        path={edgePath}
        style={{
          ...style,
          strokeWidth: 3,
          stroke: data?.color || '#9b87f5',
          strokeDasharray: data?.dashed ? '5,5' : 'none',
          opacity: 0.8,
        }}
      />
      {/* Glow effect for edges */}
      <BaseEdge 
        path={edgePath}
        style={{
          strokeWidth: 10,
          stroke: data?.color || '#9b87f5',
          opacity: 0.1,
          filter: 'blur(3px)',
        }}
      />
    </>
  );
};

export default CustomEdge;
