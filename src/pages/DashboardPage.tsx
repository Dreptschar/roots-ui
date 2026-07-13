import { Layout } from '../components/Layout';
import { PlantCard } from '../components/PlantCard';
import { usePlants } from '../hooks/usePlants';

export function DashboardPage() {
  const { plants, loading } = usePlants();

  return (
    <Layout title="Plant dashboard" subtitle="Keep care tasks close at hand on mobile and desktop.">
      <section className="panel">
        <div className="panelHeader">
          <h2>My plants</h2>
        </div>
        {loading ? <p>Loading plants…</p> : null}
        <div className="grid">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
