import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { getBestDeals } from "../../services/itadService.js";
import DealCard from "../../components/deals/DealCard.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

export default function BestDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  const observer = useRef(null);

  const loadDeals = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const newDeals = await getBestDeals(offset, LIMIT);
      if (newDeals.length === 0) {
        setHasMore(false);
      } else {
        setDeals((prev) => {
          const combined = [...prev, ...newDeals];
          const unique = combined.filter(
            (d, index, self) => index === self.findIndex((g) => g.id === d.id)
          );
          return unique;
        });
        setOffset((prev) => prev + LIMIT);
      }
    } catch (err) {
      toast.error("Erro ao carregar promoções.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [offset, hasMore, loading]);

  useEffect(() => {
    loadDeals();
  }, []);

  const lastDealRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadDeals();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadDeals]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        Melhores Promoções
      </h1>

      {deals.length === 0 && !loading && (
        <p className="text-center text-gray-600">Nenhuma promoção encontrada.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deals.map((deal, index) => {
          if (index === deals.length - 1) {
            return (
              <div ref={lastDealRef} key={`${deal.id}-${index}`}>
                <DealCard deal={deal} />
              </div>
            );
          }
          return <DealCard key={`${deal.id}-${index}`} deal={deal} />;
        })}
      </div>

      {loading && (
        <div className="flex justify-center mt-6">
          <LoadingSpinner />
        </div>
      )}

      {!hasMore && (
        <p className="text-center text-gray-500 mt-6">
          Todas as promoções foram carregadas.
        </p>
      )}
    </div>
  );
}
