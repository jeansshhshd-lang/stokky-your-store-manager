import { Package, HandCoins, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardLayout } from "@/components/DashboardLayout";

const stats = [
  { title: "Total em Estoque", value: "R$ 24.350", icon: Package, description: "142 peças" },
  { title: "Total de Fiado", value: "R$ 3.780", icon: HandCoins, description: "18 clientes" },
  { title: "Recebimentos do Mês", value: "R$ 5.120", icon: TrendingUp, description: "+12% vs mês anterior" },
];

const fiadoClientes = [
  { nome: "Maria Silva", valor: "R$ 450,00", data: "28/03/2026", status: "pendente" as const },
  { nome: "João Santos", valor: "R$ 230,00", data: "25/03/2026", status: "pago" as const },
  { nome: "Ana Costa", valor: "R$ 680,00", data: "22/03/2026", status: "pendente" as const },
  { nome: "Carlos Oliveira", valor: "R$ 150,00", data: "20/03/2026", status: "pago" as const },
  { nome: "Fernanda Lima", valor: "R$ 320,00", data: "18/03/2026", status: "pendente" as const },
  { nome: "Pedro Almeida", valor: "R$ 190,00", data: "15/03/2026", status: "pago" as const },
];

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral da sua loja</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fiado Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Últimas Compras Fiado</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="hidden sm:table-cell">Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fiadoClientes.map((cliente, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>{cliente.valor}</TableCell>
                    <TableCell className="hidden sm:table-cell">{cliente.data}</TableCell>
                    <TableCell>
                      <Badge
                        variant={cliente.status === "pago" ? "default" : "secondary"}
                        className={
                          cliente.status === "pago"
                            ? "bg-success text-success-foreground"
                            : "bg-warning/15 text-warning border-warning/30"
                        }
                      >
                        {cliente.status === "pago" ? "Pago" : "Pendente"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
