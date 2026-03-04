import { motion } from "framer-motion";
import { Button, Card, CardBody } from "@heroui/react";
import { Plus, Edit3 } from "lucide-react";
import Link from "next/link";

export default function CollectionsTab({ collections }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-serif font-bold">Your Series</h3>
        <Button size="sm" radius="full" variant="bordered" startContent={<Plus size={14}/>} className="border-border uppercase font-bold text-[10px] tracking-widest hover:bg-foreground hover:text-background">
          New Series
        </Button>
      </div>

      {collections.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-border rounded-xl bg-card">
          <p className="text-muted-foreground font-serif">You haven't created any collections yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map(col => (
            <Card key={col.id} className="bg-card border border-border shadow-sm rounded-xl hover:border-brand-blue/40 transition-colors">
              <CardBody className="flex flex-row items-center justify-between p-6">
                <div>
                  <h4 className="font-serif font-bold text-lg mb-1">{col.name}</h4>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{col.articles_count} Articles</p>
                </div>
                <Button isIconOnly variant="light" as={Link} href={`/collections/edit/${col.id}`}>
                  <Edit3 size={18} className="text-muted-foreground" />
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}