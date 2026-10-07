/** Loads GSAP and ScrollTrigger on demand so they stay out of the critical path. */
export async function loadGsap() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  return gsap;
}
