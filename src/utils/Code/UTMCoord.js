const  DTOR =  0.017453292519943295;
const  RTOD =  57.295779513082323;
function Vector2d(x,y){
    this.x = x || 0;
    this.y = y || 0;
}

function UTMCoord(){
    this.sm_a = 6378137.0;                     //地球赤道半径
    this.sm_b = 6356752.314;                   //地球极地半径
    this.sm_EccSquared = 6.69437999013e-03;
    this.UTMScaleFactor = 0.9996;
}

UTMCoord.prototype.UTMZone = function(longitude){
    let zone = Math.floor((longitude + 180.0) / 6) + 1;
    return zone; 
}

/// <summary>
/// 经纬度转UTM投影坐标
/// </summary>
/// <param name="geoPt">经纬度（度），x:经度，y:纬度</param>
/// <param name="zone">UTM zone</param>
/// <returns>UTM投影坐标（米），x:东向, y:北向</returns>
UTMCoord.prototype.GeoToLocation = function(geoPt, zone)
{
    //角度转弧度
    let Xtemp = geoPt.x * DTOR;
    let Ytemp = geoPt.y * DTOR;
    
    let  mapPt = this.GeoToUTM(new Vector2d(Xtemp, Ytemp), zone);
    return mapPt;
}

UTMCoord.prototype.GeoToUTM = function(pt, zone)
{
    let xy = new Vector2d();
    this.LatLonToUTMXY(pt.y, pt.x, zone,  xy);
    return xy;
}

/// <summary>
/// 经纬度转换成UTM投影坐标
/// </summary>
/// <param name="lat">纬度（弧度）</param>
/// <param name="lon">经度（弧度）</param>
/// <param name="zone">UTM zone</param>
/// <param name="xy">UTM坐标（米）, x:东向，y:北向</param>
UTMCoord.prototype.LatLonToUTMXY = function( lat, lon, zone,  xy)
{
    this.MapLatLonToXY(lat, lon, this.UTMCentralMeridian(zone), xy);

    /* Adjust easting and northing for UTM system. */
    xy.x = xy.x * this.UTMScaleFactor + 500000.0;
    xy.y = xy.y * this.UTMScaleFactor;
    if (xy.y < 0.0)
        xy.y += 10000000.0;
}

/// <summary>
/// UTM投影坐标转经纬度
/// </summary>
/// <param name="utmPt">UTM投影坐标（米），x:东向, y:北向</param>
/// <param name="zone">UTM zone</param>
/// <param name="southhemi">是否在南半球</param>
/// <returns>经纬度（度），x:经度，y:纬度</returns>
UTMCoord.prototype.LocationToGeo = function( utmPt,  zone,  southhemi)
{
    let geoPt = this.UTMXYToLatLon(utmPt.x, utmPt.y, zone, southhemi);
    geoPt.x *= RTOD;
    geoPt.y *= RTOD;

    return geoPt;
}
/// <summary>
/// UTM中央子午线，根据给定的UTM Zone确定中央子午线的经度值 （弧度值，角度值范围 -177 ~ + 177, 如果zone不在1-60的范围，则为0）
/// </summary>
/// <param name="zone"></param>
/// <returns></returns>
UTMCoord.prototype.UTMCentralMeridian = function( zone)
{
    return DTOR * (-183.0 + (zone * 6.0));
}

/// <summary>
/// 经纬度转换成墨卡托投影坐标
/// </summary>
/// <param name="phi">纬度（弧度）</param>
/// <param name="lambda">经度（弧度）</param>
/// <param name="lambda0">该zone的中央子午线的经度（弧度）</param>
/// <param name="xy">返回墨卡托坐标值</param>
UTMCoord.prototype.MapLatLonToXY = function( phi,  lambda,  lambda0,   xy)
{
    let N, nu2, ep2, t, t2, l;
    let l3coef, l4coef, l5coef, l6coef, l7coef, l8coef;
    let tmp;

    /* Precalculate ep2 */
    ep2 = (Math.pow(this.sm_a, 2.0) - Math.pow(this.sm_b, 2.0)) / Math.pow(this.sm_b, 2.0);

    /* Precalculate nu2 */
    nu2 = ep2 * Math.pow(Math.cos(phi), 2.0);

    /* Precalculate N */
    N = Math.pow(this.sm_a, 2.0) / (this.sm_b * Math.sqrt(1 + nu2));

    /* Precalculate t */
    t = Math.tan(phi);
    t2 = t * t;
    tmp = (t2 * t2 * t2) - Math.pow(t, 6.0);

    /* Precalculate l */
    l = lambda - lambda0;

    /* Precalculate coefficients for l**n in the equations below
    so a normal human being can read the expressions for easting
    and northing
    -- l**1 and l**2 have coefficients of 1.0 */
    l3coef = 1.0 - t2 + nu2;

    l4coef = 5.0 - t2 + 9 * nu2 + 4.0 * (nu2 * nu2);

    l5coef = 5.0 - 18.0 * t2 + (t2 * t2) + 14.0 * nu2 - 58.0 * t2 * nu2;

    l6coef = 61.0 - 58.0 * t2 + (t2 * t2) + 270.0 * nu2 - 330.0 * t2 * nu2;

    l7coef = 61.0 - 479.0 * t2 + 179.0 * (t2 * t2) - (t2 * t2 * t2);

    l8coef = 1385.0 - 3111.0 * t2 + 543.0 * (t2 * t2) - (t2 * t2 * t2);

    /* Calculate easting (x) */
    xy.x = N * Math.cos(phi) * l + (N / 6.0 * Math.pow(Math.cos(phi), 3.0) * l3coef * Math.pow(l, 3.0))
        + (N / 120.0 * Math.pow(Math.cos(phi), 5.0) * l5coef * Math.pow(l, 5.0))
        + (N / 5040.0 * Math.pow(Math.cos(phi), 7.0) * l7coef * Math.pow(l, 7.0));

    /* Calculate northing (y) */
    xy.y = this.ArcLengthOfMeridian(phi)
        + (t / 2.0 * N * Math.pow(Math.cos(phi), 2.0) * Math.pow(l, 2.0))
        + (t / 24.0 * N * Math.pow(Math.cos(phi), 4.0) * l4coef * Math.pow(l, 4.0))
        + (t / 720.0 * N * Math.pow(Math.cos(phi), 6.0) * l6coef * Math.pow(l, 6.0))
        + (t / 40320.0 * N * Math.pow(Math.cos(phi), 8.0) * l8coef * Math.pow(l, 8.0));
}

/// <summary>
/// 子午线弧长，纬度点到赤道的椭球距离（米）
/// </summary>
/// <param name="phi">纬度（弧度）</param>
/// <returns></returns>
UTMCoord.prototype.ArcLengthOfMeridian = function( phi)
{
    let alpha, beta, gamma, delta, epsilon, n;
    let result;

    /* Precalculate n */
    n = (this.sm_a - this.sm_b) / (this.sm_a + this.sm_b);

    /* Precalculate alpha */
    alpha = ((this.sm_a + this.sm_b) / 2.0)
        * (1.0 + (Math.pow(n, 2.0) / 4.0) + (Math.pow(n, 4.0) / 64.0));

    /* Precalculate beta */
    beta = (-3.0 * n / 2.0) + (9.0 * Math.pow(n, 3.0) / 16.0)
        + (-3.0 * Math.pow(n, 5.0) / 32.0);

    /* Precalculate gamma */
    gamma = (15.0 * Math.pow(n, 2.0) / 16.0)
        + (-15.0 * Math.pow(n, 4.0) / 32.0);

    /* Precalculate delta */
    delta = (-35.0 * Math.pow(n, 3.0) / 48.0)
        + (105.0 * Math.pow(n, 5.0) / 256.0);

    /* Precalculate epsilon */
    epsilon = (315.0 * Math.pow(n, 4.0) / 512.0);

    /* Now calculate the sum of the series and return */
    result = alpha
        * (phi + (beta* Math.sin(2.0 * phi))
            + (gamma* Math.sin(4.0 * phi))
            + (delta* Math.sin(6.0 * phi))
            + (epsilon* Math.sin(8.0 * phi)));

    return result;
}
/// <summary>
/// 垂足点纬度，用于墨卡托到地心坐标系的转换
/// </summary>
/// <param name="y">UTM北向坐标值（米）</param>
/// <returns>纬度（弧度）</returns>
UTMCoord.prototype.FootpointLatitude = function(y)
{
    let y_, alpha_, beta_, gamma_, delta_, epsilon_, n;
    let result;

    /* Precalculate n(Eq.10.18) */
    n = (this.sm_a - this.sm_b) / (this.sm_a + this.sm_b);

    /* Precalculate alpha_(Eq.10.22) */
    /* (Same as alpha in Eq.10.17) */
    alpha_ = ((this.sm_a + this.sm_b) / 2.0) * (1 + Math.pow(n, 2.0) / 4) + (Math.pow(n, 4.0) / 64);

    /* Precalculate y_(Eq.10.23) */
    y_ = y / alpha_;

    /* Precalculate beta_(Eq.10.22) */
    beta_ = (3.0 * n / 2.0) + (-27.0 * Math.pow(n, 3.0) / 32.0) + (269.0 * Math.pow(n, 5.0) / 512.0);

    /* Precalculate gamma_(Eq.10.22) */
    gamma_ = (21.0 * Math.pow(n, 2.0) / 16.0) + (-55.0 * Math.pow(n, 4.0) / 32.0);

    /* Precalculate delta_(Eq.10.22) */
    delta_ = (151.0 * Math.pow(n, 3.0) / 96.0) + (-417.0 * Math.pow(n, 5.0) / 128.0);

    /* Precalculate epsilon_(Eq.10.22) */
    epsilon_ = (1097.0 * Math.pow(n, 4.0) / 512.0);

    /* Now calculate the sum of the series(Eq.10.21) */
    result = y_ 
        + (beta_ * Math.sin(2.0 * y_)) 
        + (gamma_ * Math.sin(4.0 * y_)) 
        + (delta_ * Math.sin(6.0 * y_)) 
        + (epsilon_ * Math.sin(8.0 * y_));

    return result;
}
/// <summary>
/// 墨卡托投影转换成经纬度
/// </summary>
/// <param name="x">东向坐标值（米）</param>
/// <param name="y">北向坐标值（米）</param>
/// <param name="lambda0">当前zone的中央子午线的经度（弧度）</param>
/// <param name="philambda">返回经纬度（弧度）, x:经度，y:纬度</param>
UTMCoord.prototype.MapXYToLatLon = function(x, y,  lambda0,  philambda)
{
    let phif, Nf, Nfpow, nuf2, ep2, tf, tf2, tf4, cf;
    let x1frac, x2frac, x3frac, x4frac, x5frac, x6frac, x7frac, x8frac;
    let x2poly, x3poly, x4poly, x5poly, x6poly, x7poly, x8poly;

    /* Get the value of phif, th footpoint latitude. */
    phif = this.FootpointLatitude(y);

    /* Precalculate ep2 */
    ep2 = (Math.pow(this.sm_a, 2.0) - Math.pow(this.sm_b, 2.0)) / Math.pow(this.sm_b, 2.0);

    /* Precalculate cos(phif) */
    cf = Math.cos(phif);

    /* Precalculate nuf2 */
    nuf2 = ep2 * Math.pow(cf, 2.0);

    /* Precalculate Nf and initialize Nfpow */
    Nf = Math.pow(this.sm_a, 2.0) / (this.sm_b * Math.sqrt(1 + nuf2));
    Nfpow = Nf;

    /* Precalculate tf */
    tf = Math.tan(phif);
    tf2 = tf * tf;
    tf4 = tf2 * tf2;

    /* Precalculate fractional coefficients for x**n in the equations below to simplify the expressions for latitude and longitude. */
    x1frac = 1.0 / (Nfpow * cf);
    Nfpow *= Nf;/* Now equals Nf**2 */
    x2frac = tf / (2.0 * Nfpow);
    Nfpow *= Nf;/* Now equals Nf**3 */
    x3frac = 1.0 / (6.0 * Nfpow * cf);
    Nfpow *= Nf;/* Now equals Nf**4 */
    x4frac = tf / (24.0 * Nfpow);
    Nfpow *= Nf;/* Now equals Nf**5 */
    x5frac = 1.0 / (120.0 * Nfpow * cf);
    Nfpow *= Nf;/* Now equals Nf**6 */
    x6frac = tf / (720.0 * Nfpow);
    Nfpow *= Nf;/* Now equals Nf**7 */
    x7frac = 1.0 / (5040.0 * Nfpow * cf);
    Nfpow *= Nf;/* Now equals Nf**8 */
    x8frac = tf / (40320.0 * Nfpow);

    /* Precalculate polynomial coefficients for x**n.
        * -- x**1 does not have a polynomial coefficient. */
    x2poly = -1.0 - nuf2;
    x3poly = -1.0 - 2 * tf2 - nuf2;
    x4poly = 5.0 + 3.0 * tf2 + 6.0 * nuf2 - 6.0 * tf2 * nuf2 - 3.0*(nuf2 * nuf2) - 9.0 * tf2 * (nuf2 * nuf2);
    x5poly = 5.0 + 28.0 * tf2 + 24.0 * tf4 + 6.0 * nuf2 + 8.0 * tf2 * nuf2;
    x6poly = -61.0 - 90.0 * tf2 - 45.0 * tf4 - 107.0 * nuf2 + 162.0 * tf2 * nuf2;
    x7poly = -61.0 - 662.0 * tf2 - 1320.0 * tf4 - 720.0 * (tf4 * tf2);
    x8poly = 1385.0 + 3633.0 * tf2 + 4095.0 * tf4 + 1575.0 * (tf4 * tf2);

    /* Calculate latitude */
    philambda.y = phif
        + x2frac * x2poly * (x * x)
        + x4frac * x4poly * Math.pow(x, 4.0)
        + x6frac * x6poly * Math.pow(x, 6.0)
        + x8frac * x8poly * Math.pow(x, 8.0);

    /* Calculate longitude */
    philambda.x = lambda0
        + x1frac * x
        + x3frac * x3poly * Math.pow(x, 3.0)
        + x5frac * x5poly * Math.pow(x, 5.0)
        + x7frac * x7poly * Math.pow(x, 7.0);
}
/// <summary>
/// UTM投影坐标转换成经纬度
/// </summary>
/// <param name="x">UTM东向坐标值（米）</param>
/// <param name="y">UTM北向坐标值（米）</param>
/// <param name="zone">UTM zone</param>
/// <param name="southhemi">是否在南半球</param>
/// <returns>经纬度（弧度），x:经度， y:纬度</returns>
UTMCoord.prototype.UTMXYToLatLon = function( x,  y,  zone,  southhemi)
{
    let cmeridian;
    x -= 500000.0;
    x /= this.UTMScaleFactor;

    /* If in southern hemisphere, adjust y accordingly. */
    if (southhemi)
        y -= 10000000.0;

    y /= this.UTMScaleFactor;

    cmeridian = this.UTMCentralMeridian(zone);

    let result = new Vector2d();
    this.MapXYToLatLon(x, y, cmeridian, result);

    return result;
}
export default UTMCoord