import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "@/components/ui/table";

const colorSwatches = [
  { label: "Background", className: "bg-background" },
  { label: "Surface", className: "bg-surface" },
  { label: "Surface Muted", className: "bg-surface-muted" },
  { label: "Ink", className: "bg-foreground" },
  { label: "Muted", className: "bg-muted" },
  { label: "Accent", className: "bg-accent" },
  { label: "Accent Soft", className: "bg-accent-soft" },
  { label: "Border", className: "bg-border" },
];

export default function DesignProofPage() {
  return (
    <div className="bg-background px-6 pb-16 pt-12 text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
            Coremont Design System
          </p>
          <h1 className="text-4xl font-semibold text-foreground md:text-5xl">
            Premium, restrained commerce foundation
          </h1>
          <p className="max-w-2xl text-base text-muted md:text-lg">
            This internal proof validates typography, tokens, component rhythm, and UI polish
            before assembling storefront pages.
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge variant="accent">Coremont Accent</Badge>
            <Badge variant="neutral">Neutral Surface</Badge>
            <Badge variant="success">In Stock</Badge>
            <Badge variant="warning">Low Stock</Badge>
            <Badge variant="error">Back Order</Badge>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Typography scale</CardTitle>
              <CardDescription>Serif headlines with compact, legible body text.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted">Headline</p>
                <p className="text-3xl font-semibold">Strength equipment, refined.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted">Subheading</p>
                <p className="text-xl font-medium">Built for daily training in compact spaces.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted">Body</p>
                <p className="text-sm text-muted">
                  Coremont curates equipment with clean finishes, reliable mechanics, and
                  consistent delivery throughout Europe.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted">Utility</p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Warranty included
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color system</CardTitle>
              <CardDescription>Warm neutrals with one controlled accent.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {colorSwatches.map((swatch) => (
                <div
                  key={swatch.label}
                  className="rounded-[var(--radius-sm)] border border-border bg-surface p-3"
                >
                  <div className={`h-10 w-full rounded-[var(--radius-sm)] ${swatch.className}`} />
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {swatch.label}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Buttons & inputs</CardTitle>
              <CardDescription>Defined actions with restrained emphasis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Button>Primary Action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="studio@coremont.eu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <Input id="search" placeholder="Search equipment" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <p className="text-xs text-muted">Inputs hold 44px minimum touch height.</p>
              <Button size="sm" variant="outline">
                View focus state
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card rhythm</CardTitle>
              <CardDescription>Product-style card spacing and hierarchy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[var(--radius-md)] border border-border bg-surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Featured
                </p>
                <h3 className="mt-3 text-lg font-semibold">Coremont Compact Rack S1</h3>
                <p className="mt-2 text-sm text-muted">
                  Stable, compact rack with adjustable safety arms and dense steel frame.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-base font-semibold">€780</p>
                  <Badge variant="success">In Stock</Badge>
                </div>
              </div>
              <div className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Stock note</p>
                <p className="mt-2 text-sm text-muted">
                  Low stock states use amber tone and stay calm, never alarmist.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Table styling</CardTitle>
              <CardDescription>Admin-ready, compact tables with clear hierarchy.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Order</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell>Customer</TableHeadCell>
                    <TableHeadCell>Total</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>CM-84A2</TableCell>
                    <TableCell>
                      <Badge variant="success">Confirmed</Badge>
                    </TableCell>
                    <TableCell>Julien Bernard</TableCell>
                    <TableCell>€2,480</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CM-72C9</TableCell>
                    <TableCell>
                      <Badge variant="warning">Pending</Badge>
                    </TableCell>
                    <TableCell>Sofia Rossi</TableCell>
                    <TableCell>€1,190</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CM-19D1</TableCell>
                    <TableCell>
                      <Badge variant="neutral">Packed</Badge>
                    </TableCell>
                    <TableCell>Lena Meyer</TableCell>
                    <TableCell>€3,260</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
