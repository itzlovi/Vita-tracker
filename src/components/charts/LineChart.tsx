import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension?: number;
      fill?: boolean;
    }[];
  };
  height?: number;
  title?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  height = 300, 
  title, 
  yAxisLabel, 
  showLegend = true 
}) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          padding: 20,
        },
      },
      title: {
        display: !!title,
        text: title || '',
        font: {
          size: 16,
        },
        padding: {
          bottom: 16,
        },
        color: '#334155',
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 8,
          color: '#64748b',
        },
      },
      y: {
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel || '',
          color: '#64748b',
          padding: {
            bottom: 10,
          },
        },
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          padding: 8,
          color: '#64748b',
        },
        border: {
          dash: [4, 4],
        }
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
      point: {
        radius: 3,
        hoverRadius: 5,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChart;