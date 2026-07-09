import type { PortfolioMetric } from '../../data/portfolio'

type MetricProps = {
  metric: PortfolioMetric
}

function Metric({ metric }: MetricProps) {
  return (
    <div className="metric">
      <p className="metric__value">{metric.value}</p>
      <p className="metric__label">{metric.label}</p>
      <p className="metric__context">{metric.context}</p>
    </div>
  )
}

export default Metric
