import NavComponent from './components/nav';
import FooterComponent from './components/footer';
import EventViewerComponent from './components/eventViewer';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <div className="App">
      {/* Simulated Nav Component */}
      <NavComponent />
      {/* Main Viewer Component */}
      <EventViewerComponent />
      {/* Simulated Footer Component */}
      <FooterComponent />
    </div>
  );
}

export default App;
