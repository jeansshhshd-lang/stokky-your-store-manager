import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { HandCoins } from "lucide-react";

const Fiado = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fiado</h2>
          <p className="text-muted-foreground">Controle de vendas fiado</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <HandCoins className="h-12 w-12 mb-4 text-primary/40" />
            <p className="text-lg font-medium">Em breve</p>
            <p className="text-sm">O controle de fiado estará disponível aqui.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Fiado;
