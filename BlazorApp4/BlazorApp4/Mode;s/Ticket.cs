namespace BlazorApp4.Mode_s
{
    public class Ticket
    {
        public int Id { get; set; }
        public SD.Sex Gender { get; set; }
        public int Age { get; set; }
        public SD.TypeM MemberType { get; set; }
        public int Month { get; set; }
        public double Price => MemberType == SD.TypeM.member ? 100 : 150;
        public double Discount()
        {
            var rate = Age switch
            {
                >= 20 => 0,
                >= 10 => 0.05,
                _ => 0.1,
            };
            return Price * rate;
        }
        public double Net => Price - Discount();
    }
    public class ReportByQuarter
    {
        public string MonthRange { get; set;}
        public double SumNet { get; set;}
        public double CountMember { get; set;}
        public double CountGeneral { get; set;}
        public double CountAll => CountMember + CountGeneral;
    }
}
