import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import { usePlants } from '../hooks/usePlants';
import { PlantCard } from '../components/PlantCard';

export function DashboardPage() {
  const { plants, waterPlant } = usePlants();

  return (
    <Layout title="Plants">
      <section className="panel">
        <div className="panelHeader">
          <h2>Plants</h2>
          <Link className="primaryButton" to="/plants/new">
            Add plant
          </Link>
        </div>
        <div className="grid">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} onWater={waterPlant} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
