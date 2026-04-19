import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, ExternalLink, Share2, Award, Music, Briefcase, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  group: 'music' | 'album' | 'brand' | 'label' | 'achievement' | 'location' | 'central';
  description?: string;
  x?: number;
  y?: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

const NODES: Node[] = [
  { id: 'jeriq', name: 'JERIQ', group: 'central', description: 'The King of the East. The Business of the North. The Rhythm of the South. Leader of the Iyoo Cartel.' },
  
  // Music Connections
  { id: 'phyno', name: 'Phyno', group: 'music', description: 'Collaborator on major tracks like "Remember". A senior brother in the game.' },
  { id: 'blaqbonez', name: 'Blaqbonez', group: 'music', description: 'Collaborated on "Back to Basics".' },
  { id: 'zlatan', name: 'Zlatan', group: 'music', description: 'Collaborated on "No More Nleka".' },
  { id: 'dremo', name: 'Dremo', group: 'music', description: 'Long-term collaborator and fellow rapper.' },
  { id: 'psychoyp', name: 'PsychoYP', group: 'music', description: 'Collaborated on "Traplore".' },
  { id: 'flavour', name: 'Flavour', group: 'music', description: 'The Highlife King. Unity of sounds.' },
  { id: 'odumodublvck', name: 'Odumodublvck', group: 'music', description: 'The Okpu-Agada connection. New school street anthem.' },
  { id: 'victony', name: 'Victony', group: 'music' },
  { id: 'bella', name: 'Bella Shmurda', group: 'music' },
  { id: 'knucks', name: 'Knucks', group: 'music', description: 'UK Rap connection.' },
  { id: 'maglera', name: 'Maglera Doe Boy', group: 'music', description: 'South African street royalty connection.' },
  { id: 'tobe', name: 'Tobe Nwigwe', group: 'music', description: 'Global Igbo connection.' },
  { id: 'minz', name: 'Minz', group: 'music' },
  { id: 'ajebo', name: 'Ajebo Hustlers', group: 'music' },
  { id: 'kofi', name: 'Kofi Jamar', group: 'music' },
  { id: 'boy_spyce', name: 'Boy Spyce', group: 'music' },
  { id: 'magixx', name: 'Magixx', group: 'music' },
  { id: 'peruzzi', name: 'Peruzzi', group: 'music' },
  { id: 'king_perryy', name: 'King Perryy', group: 'music' },
  
  // Albums
  { id: 'hbd', name: 'Hood Boy Dreams', group: 'album', description: 'The breakout EP that defined the struggle.' },
  { id: 'enw', name: 'East N West', group: 'album', description: 'Joint project with Dremo.' },
  { id: 'bdd', name: 'Billion Dollar Dream', group: 'album', description: 'The chart-topping masterpiece.' },
  { id: 'king', name: 'King', group: 'album', description: 'Ascension to the throne.' },
  { id: 'btbg', name: 'Born to Be Great', group: 'album', description: 'The latest testament.' },

  // Brands
  { id: 'pepsi_n', name: 'Pepsi', group: 'brand' },
  { id: 'hero_n', name: 'Hero Lager', group: 'brand' },
  { id: 'kedu_n', name: 'Kedu App', group: 'brand' },
  { id: 'ash_n', name: 'ASHLUXURY', group: 'brand' },

  // Labels
  { id: 'iyoo_n', name: 'Iyoo Cartel', group: 'label', description: 'The independent powerhouse.' },
  { id: 'kod_n', name: 'KOD Music', group: 'label' },

  // Achievements
  { id: 'billboard_n', name: 'Billboard', group: 'achievement' },
  { id: 'rs_n', name: 'Rolling Stone', group: 'achievement' },
  { id: 'headies_n', name: 'Headies', group: 'achievement' },
  { id: 'enugu_plaque', name: 'Enugu Plaque', group: 'achievement' },

  // Locations
  { id: 'enugu_loc', name: 'Enugu', group: 'location' },
  { id: 'onitsha_loc', name: 'Onitsha', group: 'location' },
  { id: 'london_loc', name: 'London', group: 'location' },
  { id: 'sa_loc', name: 'South Africa', group: 'location' },
];

const LINKS: Link[] = [
  ...NODES.slice(1).map(node => ({ source: 'jeriq', target: node.id })),
  { source: 'phyno', target: 'enugu_loc' },
  { source: 'flavour', target: 'enugu_loc' },
  { source: 'london_loc', target: 'knucks' },
  { source: 'sa_loc', target: 'maglera' },
  { source: 'iyoo_n', target: 'bdd' },
  { source: 'iyoo_n', target: 'btbg' },
  { source: 'pepsi_n', target: 'btbg' },
];

const GROUP_COLORS: Record<string, string> = {
  central: '#1a47b8',
  music: '#F5F5F5',
  album: '#b8860b',
  brand: '#22c55e',
  label: '#ef4444',
  achievement: '#fbbf24',
  location: '#a855f7'
};

const GROUP_ICONS: Record<string, any> = {
  music: Music,
  album: Disc,
  brand: Briefcase,
  label: Award,
  achievement: Star,
  location: MapPin
};

import { Disc, Star } from 'lucide-react';

export default function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    const g = svg.append('g');

    // Zoom setup
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => g.attr('transform', event.transform));

    svg.call(zoom);

    // Simulation setup
    const simulation = d3.forceSimulation<Node>(NODES)
      .force('link', d3.forceLink<Node, Link>(LINKS).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Links (electricity lines)
    const link = g.append('g')
      .selectAll('line')
      .data(LINKS)
      .join('line')
      .attr('stroke', '#3b82f6') // brand-blue color roughly
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', 1.5)
      .attr('class', 'link-electric');

    // Nodes
    const node = g.append('g')
      .selectAll('g')
      .data(NODES)
      .join('g')
      .on('click', (event, d) => {
        setSelectedNode(d);
        event.stopPropagation();
      })
      .call(d3.drag<SVGGElement, Node>()
        .on('start', (event) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on('drag', (event) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on('end', (event) => {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }) as any
      );

    // Node circles
    node.append('circle')
      .attr('r', d => d.group === 'central' ? 35 : 20)
      .attr('fill', d => d.group === 'central' ? '#1a47b8' : '#0a0a0a')
      .attr('stroke', d => GROUP_COLORS[d.group])
      .attr('stroke-width', 2)
      .attr('class', d => d.group === 'central' ? 'node-central-pulse' : '');

    // Node labels
    node.append('text')
      .text(d => d.name)
      .attr('x', 0)
      .attr('y', d => d.group === 'central' ? 55 : 35)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', d => d.group === 'central' ? '14px' : '10px')
      .attr('font-weight', 'bold')
      .attr('class', 'font-sans uppercase tracking-widest pointer-events-none opacity-60');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
      svg.selectAll('*').remove();
    };
  }, []);

  return (
    <section id="knowledge" className="h-screen bg-brand-black relative overflow-hidden flex flex-col pt-32">
       <header className="mb-12 text-center absolute top-32 left-0 w-full pointer-events-none z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 border border-brand-blue/30 rounded-full bg-brand-blue/5 mb-4"
          >
            <span className="text-[10px] font-bold tracking-[0.5em] text-brand-blue-glow uppercase">The OGBE Network</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-display text-white text-glow mb-4">Jeriq's Universe</h2>
          <p className="text-white/20 tracking-[0.4em] uppercase text-[10px]">Interact with the data. Drag, zoom, and discover the hierarchy.</p>
       </header>

       <div ref={containerRef} className="flex-1 w-full bg-[#050505] cursor-grab active:cursor-grabbing">
         <svg ref={svgRef} className="w-full h-full" />
       </div>

       {/* Simulation Styling */}
       <style>{`
          .node-central-pulse {
            animation: central-pulse 3s infinite ease-in-out;
            filter: drop-shadow(0 0 20px rgba(26, 71, 184, 0.8));
          }
          @keyframes central-pulse {
            0% { r: 35; stroke-opacity: 0.8; }
            50% { r: 42; stroke-opacity: 1; filter: drop-shadow(0 0 40px rgba(26, 71, 184, 1)); }
            100% { r: 35; stroke-opacity: 0.8; }
          }
          .link-electric {
             animation: electric-dash 30s linear infinite;
             stroke-dasharray: 2 4;
          }
          @keyframes electric-dash {
            from { stroke-dashoffset: 200; }
            to { stroke-dashoffset: 0; }
          }
       `}</style>

       {/* Side Panel Detail View */}
       <AnimatePresence>
         {selectedNode && (
           <motion.div
             initial={{ x: '100%' }}
             animate={{ x: 0 }}
             exit={{ x: '100%' }}
             className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-brand-black/95 backdrop-blur-2xl z-[300] border-l border-white/10 shadow-[-]50px_0_100px_rgba(0,0,0,0.8)] p-12 flex flex-col"
           >
             <button 
               onClick={() => setSelectedNode(null)}
               className="self-end text-white/40 hover:text-white transition-colors"
             >
               <X size={32} />
             </button>

             <div className="mt-20 flex-1">
               <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    {(() => {
                      const Icon = GROUP_ICONS[selectedNode.group] || Info;
                      return <Icon className={cn("w-10 h-10", selectedNode.group === 'central' ? 'text-brand-blue' : 'text-white')} />;
                    })()}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.4em] text-brand-blue-glow uppercase">{selectedNode.group}</p>
                    <h3 className="text-4xl font-display text-white tracking-widest">{selectedNode.name}</h3>
                  </div>
               </div>

               <div className="space-y-12">
                 <div>
                    <h4 className="text-[10px] font-bold text-white/20 tracking-[0.3em] uppercase mb-4 border-b border-white/5 pb-2">Biography & Data</h4>
                    <p className="text-white/60 text-sm leading-relaxed font-sans italic">
                      {selectedNode.description || "Historical data point within the Iyoo Cartel network. Part of the systematic growth of the Eastern civilization."}
                    </p>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="glass-card p-6 rounded-xl border-white/5">
                       <p className="text-[8px] text-white/20 uppercase tracking-widest mb-1">Status</p>
                       <p className="text-xs text-white font-bold tracking-widest">VERIFIED</p>
                    </div>
                    <div className="glass-card p-6 rounded-xl border-white/5">
                       <p className="text-[8px] text-white/20 uppercase tracking-widest mb-1">Origin</p>
                       <p className="text-xs text-white font-bold tracking-widest uppercase">{selectedNode.group === 'location' ? selectedNode.name : '042'}</p>
                    </div>
                 </div>
               </div>
             </div>

             <div className="pt-12 border-t border-white/5 flex gap-4">
               <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold tracking-widest uppercase py-4 rounded-lg flex items-center justify-center gap-2 transition-all">
                 <Share2 size={14} />
                 Share Connection
               </button>
               <button className="p-4 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-glow transition-all">
                 <ExternalLink size={18} />
               </button>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
    </section>
  );
}
