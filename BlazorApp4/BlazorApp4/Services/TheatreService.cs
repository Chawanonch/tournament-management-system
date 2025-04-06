using BlazorApp4.Mode_s;
using System.Linq;

namespace BlazorApp4.Services
{
    public class TheatreService : ITheatreService
    {
        Random r;
        public List<List<Ticket>> Theatres;
        public List<ReportByQuarter> ReportByQuarter = new();

        public TheatreService()
        {
            r = new Random();
            Theatres = new();
            CreateTheatre();
            Report();
        }

        public void CreateTheatre()
        {
            var number = r.Next(2, 6);
            for (int i = 0; i < number; i++)
            {
                Theatres.Add(CreateTicket());
            }
        }

        private List<Ticket> CreateTicket()
        {
            var num = r.Next(10, 21);
            var TempTickets = new List<Ticket>();
            for (int i = 1; i < num; i++)
            {
                TempTickets.Add(new Ticket
                {
                    Id = i,
                    Age = r.Next(3, 101),
                    Gender = (SD.Sex)r.Next(0, 2),
                    MemberType = (SD.TypeM)r.Next(0, 2),
                    Month = r.Next(1, 13),
                });
            }
            return TempTickets;
        }

        public (KeyValuePair<int, int> maxMouth, KeyValuePair<int, int> minMouth) MaxminMouth(List<Ticket> tickets)
        {
            var MaxMouth = tickets.CountBy(x => x.Month).MaxBy(x => x.Value);
            var MinMouth = tickets.CountBy(x => x.Month).MinBy(x => x.Value);
            return (MaxMouth, MinMouth);
        }

        public void Report()
        {
            var step = 3;
            for (int i = 0; i <= 10; i += step)
            {
                var start = i + 1;
                var stop = i + step;
                var tempQ = new ReportByQuarter
                {
                    MonthRange = $"Month {start} - {stop}",
                    SumNet = 0,
                    CountMember = 0,
                    CountGeneral = 0,
                };
                foreach (var th in Theatres)
                {
                    var t = th.Where(ticket => ticket.Month >= start && ticket.Month <= stop).ToList();
                    if (t.Any())
                    {
                        tempQ.SumNet += t.Sum(x => x.Net);
                        tempQ.CountMember += t.Count(x => x.MemberType.Equals(SD.TypeM.member));
                        tempQ.CountGeneral += t.Count(x => x.MemberType.Equals(SD.TypeM.general));
                    }
                }
                ReportByQuarter.Add(tempQ);
            }
        }
    }
}
