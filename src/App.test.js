import EventService from './services/event.service';

const eventService = new EventService();
test('Makes sample GET request with default params', () => {
  // Example Keys 
  // GHSA = 18bad24aaa
  // Texas State = 542bc38f95
  return eventService.fetchEventData('', '', '', '').then(data => {
    console.log(data);
    expect(data).toBeTruthy();
  })
});
