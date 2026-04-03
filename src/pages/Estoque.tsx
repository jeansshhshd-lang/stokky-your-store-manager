import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

const Estoque = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Estoque</h2>
          <p className="text-muted-foreground">Gerencie suas peças de roupa</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Package className="h-12 w-12 mb-4 text-primary/40" />
            <p className="text-lg font-medium">Em breve</p>
            <p className="text-sm">O gerenciamento de estoque estará disponível aqui.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Estoque;
