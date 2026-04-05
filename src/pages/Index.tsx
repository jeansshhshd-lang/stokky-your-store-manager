import { useEffect, useState } from "react";
import { Package, HandCoins, TrendingUp, Users } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

interface ProdutoRow {
  quantidade: number;
  preco: number;
}

interface ClienteFiadoRow {
  id: string;
  nome: string;
  valor: number;
  data: string;
  status: string;
}

const isPago = (s: string | null | undefined) => s?.toLowerCase() === "pago";
const isPendente = (s: string | null | undefined) => s?.toLowerCase() === "pendente";

const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Index = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalEstoqueValor, setTotalEstoqueValor] = useState(0);
  const [totalPecas, setTotalPecas] = useState(0);
  const [totalFiadoPendente, setTotalFiadoPendente] = useState(0);
  const [clientesPendentes, setClientesPendentes] = useState(0);
  const [recebimentosMes, setRecebimentosMes] = useState(0);
  const [ultimosFiado, setUltimosFiado] = useState<ClienteFiadoRow[]>([]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      const [prodRes, fiadoRes] = await Promise.all([
        supabase.from("produtos").select("quantidade, preco").eq("user_id", user.id),
        supabase
          .from("clientes_fiado")
          .select("id, nome, valor, data, status")
          .eq("user_id", user.id),
      ]);

      if (cancelled) return;

      const produtos = (prodRes.data ?? []) as ProdutoRow[];
      const fiado = (fiadoRes.data ?? []) as ClienteFiadoRow[];

      const estoqueValor = produtos.reduce(
        (s, p) => s + Number(p.quantidade) * Number(p.preco),
        0,
      );
      const pecas = produtos.reduce((s, p) => s + Number(p.quantidade), 0);

      const pendenteRows = fiado.filter((f) => isPendente(f.status));
      const fiadoPendenteValor = pendenteRows.reduce((s, f) => s + Number(f.valor), 0);
      const nomesPendentes = new Set(pendenteRows.map((f) => f.nome)).size;

      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth();
      const recebidos = fiado
        .filter((f) => isPago(f.status))
        .filter((f) => {
          const d = new Date(f.data);
          return !Number.isNaN(d.getTime()) && d.getFullYear() === y && d.getMonth() === m;
        })
        .reduce((s, f) => s + Number(f.valor), 0);

      const ordenados = [...fiado].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
      );

      setTotalEstoqueValor(estoqueValor);
      setTotalPecas(pecas);
      setTotalFiadoPendente(fiadoPendenteValor);
      setClientesPendentes(nomesPendentes);
      setRecebimentosMes(recebidos);
      setUltimosFiado(ordenados.slice(0, 10));
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const stats = [
    {
      title: "Total em Estoque",
      value: fmtBRL(totalEstoqueValor),
      icon: Package,
      description: `${totalPecas} peças (soma qtd × preço)`,
    },
    {
      title: "Total de Fiado Pendente",
      value: fmtBRL(totalFiadoPendente),
      icon: HandCoins,
      description: "Soma dos valores em aberto",
    },
    {
      title: "Clientes com fiado pendente",
      value: String(clientesPendentes),
      icon: Users,
      description: "Clientes distintos com status pendente",
    },
    {
      title: "Recebimentos do mês",
      value: fmtBRL(recebimentosMes),
      icon: TrendingUp,
      description: nowMonthLabel(),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Painel</h2>
          <p className="text-muted-foreground">Visão geral da sua loja</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-28 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </CardContent>
                </Card>
              ))
            : stats.map((stat) => (
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Últimas Compras Fiado</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
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
                  {ultimosFiado.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Nenhum registro de fiado
                      </TableCell>
                    </TableRow>
                  ) : (
                    ultimosFiado.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.nome}</TableCell>
                        <TableCell>{fmtBRL(Number(cliente.valor))}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {cliente.data
                            ? new Date(cliente.data).toLocaleDateString("pt-BR")
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {isPago(cliente.status) ? (
                            <Badge className="border-transparent bg-green-600 text-white hover:bg-green-600/90">
                              Pago
                            </Badge>
                          ) : (
                            <Badge className="border-transparent bg-red-600 text-white hover:bg-red-600/90">
                              pendente
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

function nowMonthLabel() {
  const d = new Date();
  return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

export default Index;
