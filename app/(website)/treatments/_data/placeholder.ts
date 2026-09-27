// PLACEHOLDER CONTENT for the service detail page, shared by every service.
// (FAQs are real admin data now; the FAQ section hides when a service has none.)
// {service} is replaced with the service name.
//
// PLACEHOLDER_CONTENT is only shown when a service has no "Detailed
// Description" in admin. It is HTML, the same shape a rich text editor
// produces, so it previews every style in `.rich-text` (theme.css).

export const PLACEHOLDER_CONTENT = `
<h2>What is {service}?</h2>
<p>{service} is a treatment designed to restore the health, function and appearance of your smile. At Ilaj Dental Care, every treatment starts with a <strong>detailed consultation</strong>, so we understand your needs before recommending anything.</p>
<p>Our specialists use modern equipment and gentle techniques to keep every visit as comfortable as possible.</p>

<h3>Who is it for?</h3>
<ul>
  <li>Patients who want a long-lasting, natural-looking result</li>
  <li>Anyone experiencing discomfort, sensitivity or difficulty chewing</li>
  <li>People looking to improve the confidence they feel in their smile</li>
</ul>

<h2>How the treatment works</h2>
<ol>
  <li><strong>Consultation:</strong> we examine your teeth and discuss your options.</li>
  <li><strong>Treatment plan:</strong> you receive a clear plan with timeline and cost.</li>
  <li><strong>Treatment:</strong> our team carries out the procedure with care and precision.</li>
  <li><strong>Aftercare:</strong> we follow up to make sure you are healing well.</li>
</ol>

<blockquote>“The team explained every step clearly and the whole experience was far more comfortable than I expected.”</blockquote>

<h3>Recovery and aftercare</h3>
<p>Most patients return to their normal routine quickly. We share simple aftercare instructions and are always available if you have questions. <a href="/contact">Contact us</a> to book your consultation.</p>
`;
