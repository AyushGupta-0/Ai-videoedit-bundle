"""Light-speed explainer — full-bleed 9:16 physics visuals with a human in frame.

Rules enforced here:
  * fit() guards every text object: nothing can ever exceed the safe frame width
  * a person (astronaut) carries the story — scale, awe and a body to identify with
  * every beat has continuous motion, not just enter/exit
  * all readable content stays above y = -3.0, clear of the caption band
Timing is locked to the VO via hold_until(t).
"""

import random

import numpy as np
from manim import *

config.pixel_width = 1080
config.pixel_height = 1920
config.frame_width = 9.0
config.frame_height = 16.0
config.frame_rate = 30
config.background_color = "#05060f"

random.seed(7)
np.random.seed(7)

CYAN = "#5AC8E0"
AMBER = "#E8A33D"
WHITE_W = "#F5F0FA"
VIOLET = "#8A5CF0"
RED = "#FF4D4D"
SUIT = "#E9EBF2"

W, H = config.frame_width, config.frame_height
XL, XR = -W / 2, W / 2
YB, YT = -H / 2, H / 2
SAFE_W = W - 1.0          # 1 unit of side margin, always
CAP_TOP = -3.0            # nothing readable below this line


def fit(m, max_w=SAFE_W):
    """Scale a mobject down if it is wider than the safe frame width."""
    if m.width > max_w:
        m.scale(max_w / m.width)
    return m


def T(txt, size=1.0, color=WHITE_W, lead=0.85, max_w=SAFE_W):
    t = Text(txt, font="Poppins", weight=BOLD, color=color, line_spacing=lead).scale(size)
    return fit(t, max_w)


def astronaut(scale=1.0, suit=SUIT, visor=CYAN):
    """A small, readable figure — the human the viewer rides along with."""
    body = RoundedRectangle(width=0.62, height=0.78, corner_radius=0.26,
                            fill_color=suit, fill_opacity=1, stroke_width=0)
    pack = RoundedRectangle(width=0.40, height=0.52, corner_radius=0.16,
                            fill_color="#9aa3b8", fill_opacity=1, stroke_width=0)
    pack.move_to(body.get_center() + LEFT * 0.33)

    helmet = Circle(radius=0.36, fill_color=suit, fill_opacity=1, stroke_width=0)
    helmet.move_to(body.get_top() + UP * 0.26)
    glass = Circle(radius=0.24, fill_color=visor, fill_opacity=0.95, stroke_width=0)
    glass.move_to(helmet.get_center() + RIGHT * 0.05)
    shine = Arc(radius=0.17, start_angle=PI * 0.25, angle=PI * 0.45,
                stroke_color=WHITE, stroke_width=3).move_to(glass.get_center() + UP * 0.05)

    arm_l = RoundedRectangle(width=0.19, height=0.46, corner_radius=0.09,
                             fill_color=suit, fill_opacity=1, stroke_width=0)
    arm_l.move_to(body.get_center() + LEFT * 0.38 + UP * 0.06).rotate(0.5)
    arm_r = RoundedRectangle(width=0.19, height=0.46, corner_radius=0.09,
                             fill_color=suit, fill_opacity=1, stroke_width=0)
    arm_r.move_to(body.get_center() + RIGHT * 0.38 + UP * 0.06).rotate(-0.7)

    leg_l = RoundedRectangle(width=0.21, height=0.48, corner_radius=0.10,
                             fill_color=suit, fill_opacity=1, stroke_width=0)
    leg_l.move_to(body.get_bottom() + DOWN * 0.18 + LEFT * 0.15).rotate(0.18)
    leg_r = RoundedRectangle(width=0.21, height=0.48, corner_radius=0.10,
                             fill_color=suit, fill_opacity=1, stroke_width=0)
    leg_r.move_to(body.get_bottom() + DOWN * 0.18 + RIGHT * 0.15).rotate(-0.3)

    stripe = Line(body.get_left() + RIGHT * 0.06, body.get_right() + LEFT * 0.06,
                  color=AMBER, stroke_width=5).move_to(body.get_center() + UP * 0.1)

    g = VGroup(pack, leg_l, leg_r, arm_l, arm_r, body, stripe, helmet, glass, shine)
    g.scale(scale)
    return g


def add_float(mob, amp=0.09, speed=1.4, spin=0.0):
    """Gentle idle motion so a figure never looks pasted on."""
    mob.f_t = random.uniform(0, 6.28)
    base = mob.get_center().copy()
    mob.f_base = base

    def _f(m, dt):
        m.f_t += dt
        target = m.f_base + UP * amp * np.sin(m.f_t * speed)
        m.shift(target - m.get_center())
        if spin:
            m.rotate(spin * dt)

    mob.add_updater(_f)
    return _f


class LightSpeed(Scene):
    def construct(self):
        self.elapsed = 0.0
        self.build_background()
        self.beat_1_beam()
        self.beat_2_chase()
        self.beat_3_rule()
        self.beat_4_gauge()
        self.beat_5_tunnel()
        self.beat_6_contract()
        self.beat_7_clocks()
        self.beat_8_andromeda()
        self.beat_9_earth()
        self.beat_10_door()

    # ---------- timing ----------
    def play_t(self, *a, run_time=1.0, **kw):
        self.play(*a, run_time=run_time, **kw)
        self.elapsed += run_time

    def hold_until(self, t):
        d = t - self.elapsed
        if d > 0.02:
            self.wait(d)
            self.elapsed = t

    def drop(self, *mobs, run_time=0.3):
        # never filter on `m in self.mobjects`: a member animated inside a temporary
        # VGroup is not tracked individually and would survive into later beats
        if mobs:
            for m in mobs:
                m.clear_updaters()
            self.play_t(*[FadeOut(m) for m in mobs], run_time=run_time)
            self.remove(*mobs)

    # ---------- persistent background ----------
    def build_background(self):
        stars = VGroup()
        for _ in range(260):
            depth = random.uniform(0.25, 1.0)
            d = Dot(point=[random.uniform(XL, XR), random.uniform(YB, YT), 0],
                    radius=0.01 + 0.03 * depth, color=WHITE_W)
            d.set_opacity(0.2 + 0.7 * depth)
            d.rate = 0.25 + 1.5 * depth
            stars.add(d)

        def drift(g, dt):
            for s in g:
                s.shift(DOWN * s.rate * dt)
                if s.get_center()[1] < YB - 0.2:
                    s.move_to([random.uniform(XL, XR), YT + 0.2, 0])

        stars.add_updater(drift)
        self.stars = stars

        grid = VGroup()
        for i in range(14):
            ln = Line([XL - 1, 0, 0], [XR + 1, 0, 0], color=VIOLET, stroke_width=2).set_opacity(0)
            ln.phase = i / 14
            grid.add(ln)
        for i in range(11):
            x = XL + i * (W / 10)
            grid.add(Line([x, YB, 0], [x * 0.25, YB + 4.2, 0], color=VIOLET,
                          stroke_width=2).set_opacity(0.18))
        h = grid[:14]

        def scroll(g, dt):
            for ln in g:
                ln.phase = (ln.phase + dt * 0.22) % 1.0
                p = ln.phase ** 2.2
                y = YB + p * 4.2
                ln.put_start_and_end_on([XL - 1, y, 0], [XR + 1, y, 0])
                ln.set_opacity(0.30 * (1 - p)).set_stroke(width=1 + 2.5 * (1 - p))

        h.add_updater(scroll)
        self.grid = grid

        glow = Circle(radius=3.2, color=CYAN, fill_opacity=0.055, stroke_width=0)
        glow.g_t = 0.0

        def breathe(m, dt):
            m.g_t += dt
            m.set_opacity(0.035 + 0.03 * (1 + np.sin(m.g_t * 1.1)) / 2)
            m.set_width(5.4 + 0.8 * np.sin(m.g_t * 0.8))

        glow.add_updater(breathe)
        self.glow = glow
        self.add(glow, grid, stars)

    # ---------- beats ----------
    def beat_1_beam(self):
        """0.00-5.16  Switch on a light."""
        bulb = Circle(radius=0.5, color=AMBER, fill_opacity=1).move_to([0, -4.9, 0])
        halo = Circle(radius=2.4, color=AMBER, fill_opacity=0.16, stroke_width=0).move_to(bulb.get_center())
        halo.t = 0.0

        def pulse(m, dt):
            m.t += dt
            m.set_width(4.8 + 1.4 * np.sin(m.t * 3.0))
            m.set_opacity(0.10 + 0.08 * (1 + np.sin(m.t * 3.0)) / 2)

        halo.add_updater(pulse)
        self.play_t(GrowFromCenter(bulb), FadeIn(halo), run_time=0.45)

        beam = Line(bulb.get_center(), bulb.get_center(), color=CYAN, stroke_width=34)
        rl = Line([-1.5, -4.9, 0], [-1.5, -4.9, 0], color=CYAN, stroke_width=7).set_opacity(0.45)
        rr = Line([1.5, -4.9, 0], [1.5, -4.9, 0], color=CYAN, stroke_width=7).set_opacity(0.45)
        self.add(beam, rl, rr)

        # the person who flicked the switch, watching it go
        person = astronaut(1.1).move_to([2.5, -5.4, 0])
        self.add(person)
        add_float(person, amp=0.07, speed=1.6)

        self.play_t(
            beam.animate.put_start_and_end_on(bulb.get_center(), [0, YT + 0.6, 0]),
            rl.animate.put_start_and_end_on([-1.5, -4.9, 0], [-1.5, YT + 0.6, 0]),
            rr.animate.put_start_and_end_on([1.5, -4.9, 0], [1.5, YT + 0.6, 0]),
            FadeIn(person, shift=UP * 0.2),
            run_time=1.1, rate_func=rate_functions.ease_out_expo,
        )

        num = T("299,792", 2.3).move_to([0, 3.4, 0])
        unit = T("KILOMETRES  PER  SECOND", 0.6, CYAN).next_to(num, DOWN, buff=0.3)
        bar = Line([XL + 0.7, 0, 0], [XR - 0.7, 0, 0], color=AMBER, stroke_width=6)
        bar.next_to(unit, DOWN, buff=0.5)
        self.play_t(FadeIn(num, shift=UP * 0.4), run_time=0.45)
        self.play_t(FadeIn(unit), Create(bar), run_time=0.4)

        self.hold_until(5.16 - 0.3)
        self.drop(bulb, halo, beam, rl, rr, num, unit, bar, person)

    def beat_2_chase(self):
        """5.16-10.90  Chase it — the gap never closes."""
        streaks = VGroup()
        for _ in range(70):
            x, y = random.uniform(XL, XR), random.uniform(YB, YT)
            ln = Line([x, y, 0], [x, y + random.uniform(0.6, 2.4), 0], color=CYAN,
                      stroke_width=random.uniform(1.5, 4)).set_opacity(random.uniform(0.15, 0.55))
            ln.v = random.uniform(5.0, 13.0)
            streaks.add(ln)

        def flow(g, dt):
            for ln in g:
                ln.shift(DOWN * ln.v * dt)
                if ln.get_top()[1] < YB:
                    ln.move_to([random.uniform(XL, XR), YT + random.uniform(0.2, 3.0), 0])

        streaks.add_updater(flow)
        self.add(streaks)

        # the viewer IS the astronaut here
        you = astronaut(1.25).move_to([-1.9, -4.6, 0])
        you_t = T("YOU", 0.58, AMBER).next_to(you, DOWN, buff=0.26)
        ph = Dot(radius=0.4, color=CYAN).move_to([2.0, -2.0, 0])
        ph_h = Circle(radius=0.95, color=CYAN, fill_opacity=0.25, stroke_width=0).move_to(ph.get_center())
        ph_t = T("LIGHT", 0.58, CYAN).next_to(ph, DOWN, buff=0.3)

        self.play_t(FadeIn(you), FadeIn(you_t), FadeIn(ph), FadeIn(ph_h), FadeIn(ph_t), run_time=0.4)
        self.play_t(
            VGroup(you, you_t).animate.shift(UP * 7.0),
            VGroup(ph, ph_h, ph_t).animate.shift(UP * 7.0),
            run_time=2.7, rate_func=rate_functions.ease_in_out_cubic,
        )

        brace = DoubleArrow([-3.4, 2.4, 0], [-3.4, 4.9, 0], color=WHITE_W,
                            stroke_width=5, buff=0, tip_length=0.3)
        glbl = T("GAP\nNEVER\nCLOSES", 0.5, WHITE_W, max_w=2.4).next_to(brace, RIGHT, buff=0.25)
        self.play_t(Create(brace), FadeIn(glbl), run_time=0.5)

        self.hold_until(10.90 - 0.35)
        self.drop(streaks, you, you_t, ph, ph_h, ph_t, brace, glbl, run_time=0.35)

    def beat_3_rule(self):
        """10.90-15.32  A rule, not an engineering limit."""
        apex = np.array([0.0, -0.3, 0.0])
        far = 14.0
        ul, ur = [apex[0] - far * .62, apex[1] + far, 0], [apex[0] + far * .62, apex[1] + far, 0]
        dl, dr = [apex[0] - far * .62, apex[1] - far, 0], [apex[0] + far * .62, apex[1] - far, 0]

        fu = Polygon(apex, ul, ur, color=CYAN, fill_opacity=0.13, stroke_width=0)
        fd = Polygon(apex, dl, dr, color=VIOLET, fill_opacity=0.09, stroke_width=0)
        e1, e2 = Line(apex, ul, color=CYAN, stroke_width=8), Line(apex, ur, color=CYAN, stroke_width=8)
        e3 = Line(apex, dl, color=VIOLET, stroke_width=6).set_opacity(0.7)
        e4 = Line(apex, dr, color=VIOLET, stroke_width=6).set_opacity(0.7)

        self.play_t(FadeIn(fu), Create(e1), Create(e2), run_time=0.7)
        self.play_t(FadeIn(fd), Create(e3), Create(e4), run_time=0.45)

        # person standing exactly at the apex — the "now" they can never escape
        who = astronaut(0.85).move_to(apex + UP * 0.35)
        self.add(who)
        add_float(who, amp=0.06, speed=1.8)
        self.play_t(FadeIn(who, scale=0.7), run_time=0.35)

        # light rays keep sweeping outward along the cone
        rays = VGroup()
        for k in range(10):
            r = Line(apex, apex, color=CYAN, stroke_width=3).set_opacity(0.55)
            r.k = k / 10
            r.side = -1 if k % 2 == 0 else 1
            rays.add(r)

        def sweep(g, dt):
            for r in g:
                r.k = (r.k + dt * 0.35) % 1.0
                L = r.k * far
                r.put_start_and_end_on(apex, [apex[0] + r.side * L * .62, apex[1] + L, 0])
                r.set_opacity(0.5 * (1 - r.k))

        rays.add_updater(sweep)
        self.add(rays)

        top = T("EVERYTHING YOU\nCAN EVER REACH", 0.78, CYAN).move_to([0, 5.8, 0])
        bot = T("FOREVER\nOUT OF REACH", 0.72, RED).move_to([0, -2.4, 0])
        self.play_t(FadeIn(top, shift=UP * 0.3), run_time=0.4)
        self.play_t(FadeIn(bot, shift=DOWN * 0.3), run_time=0.4)

        self.hold_until(15.32 - 0.35)
        self.drop(fu, fd, e1, e2, e3, e4, top, bot, who, rays, run_time=0.35)

    def beat_4_gauge(self):
        """15.32-21.95  99.99% — and the energy bill goes infinite."""
        pct = ValueTracker(0.0)
        readout = always_redraw(lambda: fit(
            Text(f"{pct.get_value():.2f}%", font="Poppins", weight=BOLD, color=WHITE_W).scale(2.9)
        ).move_to([0, 4.2, 0]))
        cap = T("OF  LIGHT  SPEED", 0.7, CYAN).move_to([0, 2.5, 0])

        track = RoundedRectangle(width=7.6, height=0.8, corner_radius=0.4,
                                 stroke_color=WHITE_W, stroke_width=4).move_to([0, 1.3, 0])
        bar = always_redraw(lambda: RoundedRectangle(
            width=max(0.12, 7.44 * pct.get_value() / 100.0), height=0.62, corner_radius=0.31,
            fill_color=CYAN, fill_opacity=1, stroke_width=0
        ).align_to(track, LEFT).shift(RIGHT * 0.08).set_y(1.3))

        # the person being pinned back by the acceleration
        rider = astronaut(1.15).move_to([0, -1.4, 0]).rotate(-0.22)
        self.add(rider)
        add_float(rider, amp=0.05, speed=2.4)

        cols = VGroup()
        for i in range(18):
            x = (-1 if i % 2 == 0 else 1) * random.uniform(3.0, 4.3)
            ln = Line([x, YB, 0], [x, YB + random.uniform(0.8, 2.6), 0], color=AMBER,
                      stroke_width=random.uniform(2, 6)).set_opacity(random.uniform(0.3, 0.8))
            ln.v = random.uniform(3.0, 9.0)
            cols.add(ln)

        def rise(g, dt):
            for ln in g:
                ln.shift(UP * ln.v * dt)
                if ln.get_bottom()[1] > YT:
                    ln.move_to([ln.get_center()[0], YB - random.uniform(0.2, 2.5), 0])

        cols.add_updater(rise)

        self.play_t(Create(track), FadeIn(readout), FadeIn(cap), FadeIn(cols),
                    FadeIn(rider), run_time=0.65)
        self.add(bar)
        self.play_t(pct.animate.set_value(99.99), run_time=3.4, rate_func=rate_functions.ease_out_expo)

        warn = T("ENERGY NEEDED", 0.75, AMBER).move_to([0, -3.0, 0])
        inf = T("∞", 2.8, AMBER).move_to([0, -4.6, 0])
        self.play_t(FadeIn(warn), FadeIn(inf, scale=1.3), run_time=0.55)

        self.hold_until(21.95 - 0.4)
        self.drop(track, bar, readout, cap, cols, warn, inf, rider, run_time=0.4)

    def beat_5_tunnel(self):
        """21.95-25.35  Relativistic aberration — and a body inside it."""
        self.remove(self.stars, self.grid)

        streaks = VGroup()
        for _ in range(430):
            ang = random.uniform(0, TAU)
            r0, L = random.uniform(0.2, 11.0), random.uniform(0.3, 3.0)
            c = interpolate_color(ManimColor(CYAN), WHITE, random.uniform(0.15, 1.0))
            streaks.add(Line([r0 * np.cos(ang), r0 * np.sin(ang), 0],
                             [(r0 + L) * np.cos(ang), (r0 + L) * np.sin(ang), 0],
                             color=c, stroke_width=random.uniform(1.6, 5.5)
                             ).set_opacity(random.uniform(0.45, 1.0)))

        core = Dot(radius=0.9, color=WHITE).set_opacity(0.0)
        halo = Circle(radius=2.0, color=CYAN, fill_opacity=0.0, stroke_width=0)
        self.add(halo, core)

        self.play_t(FadeIn(streaks, scale=0.35), core.animate.set_opacity(1.0),
                    halo.animate.set_opacity(0.3), run_time=0.8)

        # silhouette riding into the tunnel
        rider = astronaut(1.5, suit="#121622", visor=CYAN).move_to([0, -1.2, 0])
        rider.set_stroke(WHITE_W, 2, opacity=0.9)
        self.add(rider)
        add_float(rider, amp=0.12, speed=1.1, spin=0.05)
        self.play_t(FadeIn(rider, scale=0.6), run_time=0.35)

        self.play_t(
            streaks.animate.scale(3.0).set_opacity(0.12),
            core.animate.scale(0.45).set_opacity(0.5),
            halo.animate.scale(2.2).set_opacity(0.0),
            run_time=1.45, rate_func=rate_functions.ease_in_quad,
        )

        self.hold_until(25.35 - 0.25)
        self.drop(streaks, core, halo, rider, run_time=0.25)
        self.add(self.glow, self.grid, self.stars)

    def beat_6_contract(self):
        """25.35-29.50  Space contracts along the direction of travel."""
        grid = NumberPlane(
            x_range=[-6, 6, 0.9], y_range=[-11, 11, 0.9],
            background_line_style={"stroke_color": VIOLET, "stroke_width": 2.5, "stroke_opacity": 0.6},
            axis_config={"stroke_color": CYAN, "stroke_width": 4},
        )
        self.play_t(Create(grid), run_time=0.8)

        who = astronaut(1.0).move_to([0, -1.0, 0])
        self.add(who)
        add_float(who, amp=0.07, speed=1.5)
        self.play_t(FadeIn(who, scale=0.8), run_time=0.3)

        lbl = T("4 LIGHT YEARS", 0.95).move_to([0, 6.6, 0])
        self.play_t(FadeIn(lbl), run_time=0.3)

        after = T("A FEW WEEKS", 1.1, AMBER).move_to([0, 6.6, 0])
        self.play_t(grid.animate.stretch(0.18, dim=1), Transform(lbl, after),
                    run_time=1.6, rate_func=rate_functions.ease_in_out_cubic)

        sub = T("SPACE ITSELF CONTRACTS", 0.6, CYAN).move_to([0, -2.6, 0])
        self.play_t(FadeIn(sub), run_time=0.3)

        self.hold_until(29.50 - 0.3)
        self.drop(grid, lbl, sub, who, run_time=0.3)

    def beat_7_clocks(self):
        """29.50-31.23  Two clocks, two rates."""
        def mk(color, label, pos, r=1.75):
            face = Circle(radius=r, color=color, stroke_width=7).move_to(pos)
            ticks = VGroup(*[
                Line(pos + np.array([r * .84 * np.cos(a), r * .84 * np.sin(a), 0]),
                     pos + np.array([r * .97 * np.cos(a), r * .97 * np.sin(a), 0]),
                     color=color, stroke_width=4).set_opacity(0.7)
                for a in np.arange(0, TAU, TAU / 12)])
            hand = Line(pos, pos + UP * r * 0.82, color=color, stroke_width=9)
            tag = T(label, 0.66, color).move_to(pos + DOWN * (r + 0.62))
            return VGroup(face, ticks), hand, tag

        g1, h1, t1 = mk(AMBER, "YOU", np.array([0.0, 3.6, 0.0]))
        g2, h2, t2 = mk(CYAN, "EARTH", np.array([0.0, -1.3, 0.0]))
        who = astronaut(0.8).move_to([2.6, 3.6, 0])
        self.add(who)
        add_float(who, amp=0.06, speed=1.7)

        self.play_t(FadeIn(g1), FadeIn(t1), FadeIn(g2), FadeIn(t2), FadeIn(who), run_time=0.4)
        self.add(h1, h2)
        self.play_t(Rotate(h1, -PI * 0.45, about_point=np.array([0.0, 3.6, 0.0])),
                    Rotate(h2, -TAU * 3.0, about_point=np.array([0.0, -1.3, 0.0])),
                    run_time=1.0, rate_func=linear)
        self.hold_until(31.23 - 0.22)
        self.drop(g1, g2, t1, t2, h1, h2, who, run_time=0.22)

    def beat_8_andromeda(self):
        """31.23-38.83  The Andromeda run."""
        spiral = VGroup()
        for arm in range(3):
            pts = []
            for i in range(140):
                u = (i / 140) * 2.9 * PI
                th = u + arm * TAU / 3
                r = 0.22 * np.exp(0.235 * u)
                pts.append(np.array([r * np.cos(th), r * np.sin(th) * 0.62, 0]))
            a = VMobject().set_points_smoothly(pts)
            a.set_stroke(CYAN, 5, opacity=0.9)
            spiral.add(a)
        core = Dot(radius=0.45, color=WHITE_W).set_opacity(0.95)
        cg = Circle(radius=1.3, color=WHITE_W, fill_opacity=0.18, stroke_width=0)
        galaxy = VGroup(cg, spiral, core).scale(1.15).move_to([0, 5.6, 0])

        self.play_t(FadeIn(galaxy, scale=0.75), run_time=0.85)
        galaxy.add_updater(lambda m, dt: m.rotate(0.16 * dt, about_point=m.get_center()))

        # traveller crossing toward the galaxy for the whole beat
        trav = astronaut(0.95).move_to([-2.3, -2.4, 0])
        self.add(trav)
        self.play_t(FadeIn(trav, scale=0.7), run_time=0.3)

        name = T("ANDROMEDA", 0.95).move_to([0, 2.4, 0])
        dist = T("2,500,000 LIGHT YEARS", 0.58, CYAN).next_to(name, DOWN, buff=0.26)
        rule = Line([XL + 0.9, 0, 0], [XR - 0.9, 0, 0], color=CYAN, stroke_width=4)
        rule.next_to(dist, DOWN, buff=0.4)
        self.play_t(FadeIn(name), FadeIn(dist), Create(rule), run_time=0.55)

        yrs = ValueTracker(0.0)
        counter = always_redraw(lambda: fit(
            Text(f"{yrs.get_value():.0f}", font="Poppins", weight=BOLD, color=AMBER).scale(3.4)
        ).move_to([0, -1.1, 0]))
        clabel = T("YEARS OF YOUR LIFE", 0.6, AMBER).move_to([0, -2.9, 0])
        self.add(counter)
        self.play_t(FadeIn(clabel), run_time=0.25)
        self.play_t(yrs.animate.set_value(28),
                    trav.animate.move_to([2.4, -2.4, 0]),
                    run_time=2.6, rate_func=rate_functions.ease_out_cubic)

        self.hold_until(38.83 - 0.4)
        galaxy.clear_updaters()
        self.drop(galaxy, name, dist, rule, counter, clabel, trav, run_time=0.4)

    def beat_9_earth(self):
        """38.83-42.13  Home moved on without you."""
        earth = Circle(radius=2.0, color=CYAN, fill_opacity=0.2, stroke_width=7).move_to([0, 4.4, 0])
        rings = VGroup(*[
            Circle(radius=2.0 + k * 0.55, color=CYAN, stroke_width=2)
            .set_opacity(0.35 - k * 0.09).move_to([0, 4.4, 0]) for k in range(1, 4)])
        rings.add_updater(lambda m, dt: m.rotate(0.25 * dt, about_point=np.array([0.0, 4.4, 0.0])))
        tag = T("EARTH", 0.72, CYAN).move_to([0, 1.5, 0])

        who = astronaut(0.9).move_to([2.6, 1.5, 0])
        self.add(who)
        add_float(who, amp=0.07, speed=1.4)

        self.play_t(FadeIn(earth, scale=0.85), FadeIn(rings), FadeIn(tag), FadeIn(who), run_time=0.5)

        big = ValueTracker(0.0)
        roll = always_redraw(lambda: fit(
            Text(f"{int(big.get_value()):,}", font="Poppins", weight=BOLD, color=RED).scale(2.0)
        ).move_to([0, -0.6, 0]))
        rl = T("YEARS OLDER", 0.7, RED).move_to([0, -2.4, 0])
        self.add(roll)
        self.play_t(FadeIn(rl), run_time=0.25)
        self.play_t(big.animate.set_value(2_500_000), run_time=2.0, rate_func=rate_functions.ease_out_expo)

        self.hold_until(42.13 - 0.3)
        rings.clear_updaters()
        self.drop(earth, rings, tag, roll, rl, who, run_time=0.3)

    def beat_10_door(self):
        """42.13-46.51  A one-way door into the future — someone walks through."""
        l1 = T("NOT A", 1.1).move_to([0, 6.4, 0])
        l2 = T("SPEED LIMIT", 1.1).move_to([0, 5.0, 0])
        strike = Line([-3.3, 5.0, 0], [-3.3, 5.0, 0], color=RED, stroke_width=9)
        self.play_t(FadeIn(l1, shift=UP * 0.2), FadeIn(l2, shift=UP * 0.2), run_time=0.45)
        self.add(strike)
        self.play_t(strike.animate.put_start_and_end_on([-3.3, 5.0, 0], [3.3, 5.0, 0]), run_time=0.35)

        frame_d = Rectangle(width=0.2, height=0.2, color=AMBER, stroke_width=8, fill_opacity=0.06)
        frame_d.move_to([0, 0.6, 0])
        inner = Rectangle(width=0.1, height=0.1, color=AMBER, fill_opacity=0.5, stroke_width=0)
        inner.move_to([0, 0.6, 0])
        self.add(frame_d, inner)
        self.play_t(
            frame_d.animate.become(Rectangle(width=6.2, height=6.8, color=AMBER,
                                             stroke_width=8, fill_opacity=0.08).move_to([0, 0.6, 0])),
            inner.animate.become(Rectangle(width=5.4, height=6.0, color=AMBER,
                                           fill_opacity=0.13, stroke_width=0).move_to([0, 0.6, 0])),
            run_time=1.0, rate_func=rate_functions.ease_out_expo,
        )

        d1 = T("A ONE-WAY DOOR", 0.82, AMBER)
        d2 = T("INTO THE FUTURE", 0.82, AMBER)
        block = VGroup(d1, d2).arrange(DOWN, buff=0.32).move_to([0, 2.3, 0])
        self.play_t(FadeIn(block, scale=1.1), run_time=0.55)

        # the figure walks into the light and shrinks away
        walker = astronaut(1.3).move_to([0, -1.9, 0])
        self.add(walker)
        self.play_t(FadeIn(walker, shift=UP * 0.3), run_time=0.4)
        self.play_t(walker.animate.scale(0.42).move_to([0, 0.7, 0]).set_opacity(0.35),
                    run_time=1.3, rate_func=rate_functions.ease_in_out_sine)

        self.hold_until(46.51)
