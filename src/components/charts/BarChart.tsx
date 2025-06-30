import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  height?: number;
  title?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  height = 300, 
  title, 
  yAxisLabel, 
  showLegend = true 
}) => {
  const options: ChartOptions<'bar'> = {
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
        beginAtZero: true,
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
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default BarChart;