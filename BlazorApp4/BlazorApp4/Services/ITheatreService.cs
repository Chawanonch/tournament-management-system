using BlazorApp4.Mode_s;

namespace BlazorApp4.Services
{
    public interface ITheatreService
    {
        void CreateTheatre();
        (KeyValuePair<int, int> maxMouth, KeyValuePair<int, int> minMouth) MaxminMouth(List<Ticket> tickets);
    }
}
