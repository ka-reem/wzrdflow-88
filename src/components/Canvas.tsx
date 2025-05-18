
import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Panel,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Connection,
  addEdge,
  EdgeTypes,
  NodeTypes,
  Handle,
  Position,
  ConnectionLineComponentProps,
} from 'reactflow';
import CustomEdge from './CustomEdge';
import RightSidebar from './RightSidebar';
import FlowControls from './flow/FlowControls';
import ImagesToVideoNode from './nodes/ImagesToVideoNode';
import TextToTextNode from './nodes/TextToTextNode';
import TextToImageNode from './nodes/TextToImageNode';
import { useWorkflow } from '@/hooks/useWorkflow';
import { initialNodes, initialEdges } from '@/constants/flowConfig';
import { useToast } from '@/components/ui/use-toast';
import 'reactflow/dist/style.css';

const nodeTypes: NodeTypes = {
  imagesToVideo: ImagesToVideoNode,
  textToText: TextToTextNode,
  textToImage: TextToImageNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

const Canvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { saveWorkflow, loadWorkflow } = useWorkflow();
  const { toast } = useToast();

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ 
      ...connection, 
      type: 'custom',
      animated: true,
      data: { 
        color: '#9b87f5',
        dashed: false 
      }
    }, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onNodeChange = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleSave = async () => {
    await saveWorkflow(nodes, edges);
  };

  const handleLoad = async (workflowId: string) => {
    const result = await loadWorkflow(workflowId);
    if (result) {
      const { nodes: loadedNodes, edges: loadedEdges } = result;
      setNodes(loadedNodes);
      setEdges(loadedEdges);
      toast({
        title: "Success",
        description: "Workflow loaded successfully",
      });
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          fitView
          className="bg-zinc-900"
          minZoom={0.2}
          maxZoom={4}
          defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
          connectionLineStyle={{ 
            stroke: '#9b87f5', 
            strokeWidth: 3, 
            opacity: 0.7,
            strokeDasharray: '5,5'
          }}
          connectionLineComponent={(props: ConnectionLineComponentProps) => (
            <g>
              <path
                {...props}
                strokeWidth={3}
                stroke="#9b87f5"
                opacity={0.8}
              />
              <path
                {...props}
                strokeWidth={10}
                stroke="#9b87f5"
                opacity={0.1}
                filter="blur(3px)"
              />
            </g>
          )}
        >
          <Background color="#333" className="bg-zinc-900" />
          <Controls className="fill-white stroke-white" />
          <FlowControls onSave={handleSave} onLoad={handleLoad} />
          
          <Panel position="top-right" className="!absolute !right-[-256px] !top-auto !bottom-4 !w-56 !mx-4">
            <MiniMap 
              className="!bg-zinc-800 rounded-lg border border-zinc-700"
              maskColor="rgba(0, 0, 0, 0.5)"
              nodeColor="#525252"
              nodeStrokeColor="#404040"
              nodeBorderRadius={4}
              style={{ height: 120 }}
            />
          </Panel>
        </ReactFlow>
      </div>
      <RightSidebar 
        selectedNode={selectedNode}
        onNodeChange={onNodeChange}
      />
    </div>
  );
};

export default Canvas;
