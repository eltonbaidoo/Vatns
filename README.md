# Vatn Dashboard

A modern React-based time-series data visualization dashboard built for analyzing CSV data with interactive plots, channel controls, and statistical analysis.

##  Overview

Vatn Dashboard is a full-stack frontend application that allows users to upload CSV files and visualize time-series data through interactive plots. The application provides comprehensive tools for data analysis, including channel management, plot customization, zooming capabilities, and statistical calculations.

##  Features

### Core Functionality
- **CSV Upload**: Drag-and-drop or file selection for CSV data upload
- **Interactive Time-Series Plots**: Dynamic visualization of data channels
- **Channel Management**: Add, remove, and reorder data channels
- **Plot Controls**: Create, remove, and reorder multiple plots
- **Zoom & Pan**: Interactive zooming and range selection
- **Statistical Analysis**: Real-time statistics for entire datasets and selected ranges

### Statistical Features
- **Global Statistics**: Min, max, mean, median, start, end, and count for each channel
- **Range Statistics**: Statistical analysis for user-selected data ranges
- **Dynamic Updates**: Statistics update in real-time as data changes

### User Interface
- **Modern Design**: Clean, responsive interface built with Tailwind CSS
- **Drag & Drop**: Intuitive file upload and plot reordering
- **Color Customization**: Customizable plot colors for better data distinction
- **Responsive Layout**: Optimized for desktop and mobile viewing

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Next.js 15** - Full-stack React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Radix UI** - Accessible component primitives

### Key Dependencies
- **@hello-pangea/dnd** - Drag and drop functionality
- **recharts** - Data visualization and charting
- **lucide-react** - Icon library
- **class-variance-authority** - Component variant management
- **date-fns** - Date manipulation utilities

##  Project Structure

```
Vatns/
├── time-series-viewer/           # Main Next.js application
│   ├── app/                     # Next.js app directory
│   │   ├── globals.css         # Global styles and Tailwind configuration
│   │   ├── layout.tsx          # Root layout component
│   │   └── page.tsx           # Main application page
│   ├── components/             # React components
│   │   ├── channel-list.tsx    # Channel management controls
│   │   ├── csv-uploader.tsx    # File upload component
│   │   ├── plot-grid.tsx       # Plot grid container
│   │   ├── plot-panel.tsx      # Individual plot panel
│   │   ├── global-stats.tsx    # Global statistics display
│   │   ├── range-stats.tsx     # Range statistics display
│   │   ├── time-series-chart.tsx # Chart component
│   │   ├── theme-provider.tsx  # Theme context provider
│   │   └── ui/                # Reusable UI components (Radix UI)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions and state management
│   ├── public/               # Static assets
│   ├── package.json          # Dependencies and scripts
│   └── pnpm-lock.yaml       # Lock file for exact dependency versions
├── mock_data.csv             # Sample CSV data for testing
├── README.md                 # Project documentation
└── 2025 Full Stack Intern Take-Home Project (1).pdf  # Project requirements
```

##  Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm (pnpm recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/eltonbaidoo/Vatns.git
   cd Vatns
   ```

2. **Navigate to the application directory**
   ```bash
   cd time-series-viewer
   ```

3. **Install dependencies** (node_modules is not included in the repository)
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

###  What's Included vs What You Need to Install

**Included in Repository:**
- All source code (`/time-series-viewer/`)
- Package configuration (`package.json`, `pnpm-lock.yaml`)
- Project documentation and assets
- Sample CSV data (`mock_data.csv`)

**Not Included (needs installation):**
- `node_modules/` - Dependencies (install with `pnpm install`)
- `.next/` - Build output (generated automatically)
- Environment-specific files

### Build for Production

```bash
pnpm build
pnpm start
# or
npm run build
npm start
```

## Usage

### Uploading Data
1. Click the upload area or drag and drop a CSV file
2. The application will automatically parse the CSV and detect columns
3. Time-series data will be displayed in interactive plots

### Managing Channels
- **Add Channel**: Click the "+" button to add new data channels
- **Remove Channel**: Use the remove button on each channel control
- **Change Channel**: Select different data columns from the dropdown
- **Customize Colors**: Click the color picker to change plot colors

### Working with Plots
- **Add Plot**: Create new plots for different data visualizations
- **Reorder Plots**: Drag and drop plots to reorder them
- **Remove Plot**: Delete plots you no longer need
- **Zoom & Pan**: Use mouse interactions to zoom and pan through data

### Statistical Analysis
- **Global Stats**: View statistics for the entire dataset
- **Range Selection**: Click and drag on plots to select specific ranges
- **Range Stats**: View statistics for selected data ranges
- **Real-time Updates**: Statistics update automatically as you interact with data

## Design System

### Color Palette
- **Primary Blue**: #B0CDD9
- **Gray**: #B0B0B0  
- **White**: #FFFFFF
- **Extended Palette**: Additional colors for data visualization

### Component Architecture
- **Modular Design**: Reusable components for consistent UI
- **Accessibility**: Built with Radix UI primitives for accessibility
- **Responsive**: Mobile-first design approach
- **Theme Support**: Dark/light mode capabilities

##  Development

### Code Structure
- **TypeScript**: Full type safety throughout the application
- **Component Composition**: Modular, reusable components
- **Custom Hooks**: Encapsulated logic for state management
- **Utility Functions**: Shared utilities for data processing

### Key Components

#### CSVUploader
Handles file upload, parsing, and data validation.

#### PlotContainer
Manages multiple plots, drag-and-drop reordering, and plot lifecycle.

#### Plot
Individual plot component with zoom, pan, and interaction capabilities.

#### ChannelControls
Interface for managing data channels, colors, and channel-specific settings.

#### StatsPanel
Displays statistical information for datasets and selected ranges.

##  Deployment

### Build Process
```bash
npm run build
```

### Environment Variables
No environment variables required for basic functionality.

### Deployment Options
- **Vercel**: Optimized for Next.js applications
- **Netlify**: Static site deployment
- **Docker**: Containerized deployment
- **Traditional Hosting**: Static file serving

##  Future Enhancements

### Backend Integration
While currently frontend-only, the application is designed to easily integrate with backend services:

- **Data Persistence**: Save and load analysis sessions
- **User Authentication**: Multi-user support
- **Data Processing**: Server-side data transformation
- **Real-time Updates**: WebSocket integration for live data
- **Export Functionality**: PDF/PNG export of visualizations

### Additional Features
- **Advanced Analytics**: More statistical functions
- **Data Filtering**: Time-based and value-based filtering
- **Export Options**: CSV, JSON, and image export
- **Collaboration**: Shared analysis sessions
- **Mobile App**: React Native version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

##  License

This project is part of a take-home assignment. Please refer to the project requirements for usage guidelines.

##  Support

For questions or support regarding this project, please refer to the project documentation or contact the development team.

---

**Built with  using React, Next.js, and modern web technologies.**
